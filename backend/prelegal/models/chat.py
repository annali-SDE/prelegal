from typing import Any, Literal

from pydantic import BaseModel


class ChatMessageInput(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    document_type: str = "mutual_nda"
    message: str
    conversation_history: list[ChatMessageInput] = []


class NdaFields(BaseModel):
    """Explicitly-typed NDA fields used as the structured output schema (no dict[str, Any])."""
    purpose: str | None = None
    effectiveDate: str | None = None
    mndaTermType: str | None = None
    mndaTermYears: int | None = None
    confidentialityTermType: str | None = None
    confidentialityTermYears: int | None = None
    governingLaw: str | None = None
    jurisdiction: str | None = None
    party1Name: str | None = None
    party1Title: str | None = None
    party1Company: str | None = None
    party1NoticeAddress: str | None = None
    party2Name: str | None = None
    party2Title: str | None = None
    party2Company: str | None = None
    party2NoticeAddress: str | None = None


class AiStructuredOutput(BaseModel):
    """Shape the LLM must return via structured outputs."""
    reply: str
    extracted_fields: NdaFields
    is_complete: bool


class ChatResponse(BaseModel):
    reply: str
    extracted_fields: dict[str, Any]
    is_complete: bool


class GreetingResponse(BaseModel):
    message: str
