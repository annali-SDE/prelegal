from typing import Any

from pydantic import BaseModel


class DocumentCreate(BaseModel):
    document_type: str
    title: str
    fields: dict[str, Any] = {}
    chat_history: list[dict[str, Any]] = []


class DocumentUpdate(BaseModel):
    title: str | None = None
    fields: dict[str, Any] | None = None
    chat_history: list[dict[str, Any]] | None = None


class DocumentResponse(BaseModel):
    id: int
    user_id: int
    document_type: str
    title: str
    fields: dict[str, Any]
    chat_history: list[dict[str, Any]]
    created_at: str
    updated_at: str
