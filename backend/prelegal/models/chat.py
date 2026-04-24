from typing import Any, Literal

from pydantic import BaseModel


class ChatMessageInput(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    document_type: str = "mutual_nda"
    message: str
    conversation_history: list[ChatMessageInput] = []


class ChatResponse(BaseModel):
    reply: str
    extracted_fields: dict[str, Any]
    is_complete: bool


class GreetingResponse(BaseModel):
    message: str
