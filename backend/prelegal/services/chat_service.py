import asyncio

from litellm import completion

from prelegal.core.config import settings
from prelegal.models.chat import ChatResponse

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

_SYSTEM_PROMPT = """You are a professional legal document assistant for Prelegal. Your role is to help users fill out a Mutual Non-Disclosure Agreement (Mutual NDA), Common Paper Version 1.0, through friendly conversational chat.

Ask one or two questions at a time. Never overwhelm the user. Confirm values before marking a document complete. Never give legal advice — only help populate document fields.

Fields to collect (use these exact JSON key names in extracted_fields):
- purpose (string): the business purpose for sharing confidential information
- effectiveDate (string, ISO date YYYY-MM-DD): when the agreement takes effect
- mndaTermType (string, must be exactly "expires" or "until_terminated"): whether the NDA expires after a period or continues until terminated
- mndaTermYears (integer, 1-10): number of years if mndaTermType is "expires"
- confidentialityTermType (string, must be exactly "years" or "perpetuity"): duration of confidentiality obligation
- confidentialityTermYears (integer, 1-10): number of years if confidentialityTermType is "years"
- governingLaw (string): state whose law governs the agreement (e.g. "Delaware")
- jurisdiction (string): city and state for legal proceedings (e.g. "Wilmington, Delaware")
- party1Name, party1Title, party1Company, party1NoticeAddress (strings): first signing party details
- party2Name, party2Title, party2Company, party2NoticeAddress (strings): second signing party details

Required fields before is_complete = true:
purpose, effectiveDate, mndaTermType, confidentialityTermType, governingLaw, jurisdiction, party1Name, party1Company, party2Name, party2Company

Rules:
1. Extract field values from what the user says and include them in extracted_fields with exact key names above.
2. Only include a field in extracted_fields if you are confident the user stated it clearly.
3. Set is_complete to true only when ALL required fields have been provided and confirmed.
4. Do NOT ask for signature data or dates signed — those are handled separately in the UI.
5. Convert natural language dates to YYYY-MM-DD format.
6. Keep replies concise and professional."""

GREETING = "Hello! I'm here to help you create a Mutual Non-Disclosure Agreement. What's the purpose of this NDA — what are the two parties hoping to share or work on together?"


def get_greeting() -> str:
    return GREETING


async def get_ai_response(conversation_history: list[dict], user_message: str) -> ChatResponse:
    messages = [{"role": "system", "content": _SYSTEM_PROMPT}]
    messages.extend(conversation_history)
    messages.append({"role": "user", "content": user_message})

    response = await asyncio.to_thread(
        completion,
        model=MODEL,
        messages=messages,
        response_format=ChatResponse,
        extra_body=EXTRA_BODY,
        api_key=settings.openrouter_api_key,
    )
    raw = response.choices[0].message.content
    parsed = AiStructuredOutput.model_validate_json(raw)
    clean_fields = {k: v for k, v in parsed.extracted_fields.items() if v is not None}
    return ChatResponse(
        reply=parsed.reply,
        extracted_fields=clean_fields,
        is_complete=parsed.is_complete,
    )
