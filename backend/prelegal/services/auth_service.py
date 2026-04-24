import aiosqlite
from fastapi import HTTPException, status


async def create_user(db: aiosqlite.Connection, email: str, password_hash: str) -> dict:
    try:
        async with db.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING id, email",
            (email, password_hash),
        ) as cur:
            row = await cur.fetchone()
        await db.commit()
        return dict(row)
    except aiosqlite.IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")


async def find_user_by_email(db: aiosqlite.Connection, email: str) -> dict | None:
    async with db.execute(
        "SELECT id, email, password_hash FROM users WHERE email = ?", (email,)
    ) as cur:
        row = await cur.fetchone()
    return dict(row) if row else None
