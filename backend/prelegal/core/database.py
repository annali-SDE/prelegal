import aiosqlite

from prelegal.core.config import settings

_CREATE_TABLES = """
CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT    NOT NULL,
    title         TEXT    NOT NULL,
    fields        TEXT    NOT NULL DEFAULT '{}',
    chat_history  TEXT    NOT NULL DEFAULT '[]',
    created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
"""


async def init_db() -> None:
    async with aiosqlite.connect(settings.db_path) as db:
        await db.executescript(_CREATE_TABLES)
        await db.commit()


async def get_db():
    async with aiosqlite.connect(settings.db_path) as db:
        db.row_factory = aiosqlite.Row
        await db.execute("PRAGMA foreign_keys = ON")
        try:
            yield db
        except Exception:
            await db.rollback()
            raise
