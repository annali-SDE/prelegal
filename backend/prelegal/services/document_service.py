import json
from typing import Any

import aiosqlite
from fastapi import HTTPException, status


async def list_documents(db: aiosqlite.Connection, user_id: int) -> list[dict]:
    async with db.execute(
        "SELECT id, user_id, document_type, title, fields, chat_history, created_at, updated_at "
        "FROM documents WHERE user_id = ? ORDER BY updated_at DESC",
        (user_id,),
    ) as cur:
        rows = await cur.fetchall()
    return [_deserialize(dict(r)) for r in rows]


async def create_document(
    db: aiosqlite.Connection,
    user_id: int,
    document_type: str,
    title: str,
    fields: dict[str, Any],
    chat_history: list[dict],
) -> dict:
    async with db.execute(
        "INSERT INTO documents (user_id, document_type, title, fields, chat_history) "
        "VALUES (?, ?, ?, ?, ?) RETURNING id, user_id, document_type, title, fields, chat_history, created_at, updated_at",
        (user_id, document_type, title, json.dumps(fields), json.dumps(chat_history)),
    ) as cur:
        row = await cur.fetchone()
    await db.commit()
    return _deserialize(dict(row))


async def get_document(db: aiosqlite.Connection, doc_id: int, user_id: int) -> dict:
    async with db.execute(
        "SELECT id, user_id, document_type, title, fields, chat_history, created_at, updated_at "
        "FROM documents WHERE id = ? AND user_id = ?",
        (doc_id, user_id),
    ) as cur:
        row = await cur.fetchone()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return _deserialize(dict(row))


async def update_document(
    db: aiosqlite.Connection,
    doc_id: int,
    user_id: int,
    title: str | None,
    fields: dict[str, Any] | None,
    chat_history: list[dict] | None,
) -> dict:
    doc = await get_document(db, doc_id, user_id)

    new_title = title if title is not None else doc["title"]
    new_fields = fields if fields is not None else doc["fields"]
    new_chat = chat_history if chat_history is not None else doc["chat_history"]

    async with db.execute(
        "UPDATE documents SET title = ?, fields = ?, chat_history = ?, updated_at = datetime('now') "
        "WHERE id = ? AND user_id = ? "
        "RETURNING id, user_id, document_type, title, fields, chat_history, created_at, updated_at",
        (new_title, json.dumps(new_fields), json.dumps(new_chat), doc_id, user_id),
    ) as cur:
        row = await cur.fetchone()
    await db.commit()
    return _deserialize(dict(row))


async def delete_document(db: aiosqlite.Connection, doc_id: int, user_id: int) -> None:
    await get_document(db, doc_id, user_id)
    await db.execute("DELETE FROM documents WHERE id = ? AND user_id = ?", (doc_id, user_id))
    await db.commit()


def _deserialize(row: dict) -> dict:
    row["fields"] = json.loads(row["fields"])
    row["chat_history"] = json.loads(row["chat_history"])
    return row
