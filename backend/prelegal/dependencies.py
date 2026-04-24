from typing import Annotated

import aiosqlite
import jwt
from fastapi import Cookie, Depends, HTTPException, status

from prelegal.core.config import settings
from prelegal.core.database import get_db
from prelegal.core.security import decode_token

DB = Annotated[aiosqlite.Connection, Depends(get_db)]


async def _get_current_user(
    db: DB,
    prelegal_token: str | None = Cookie(default=None),
) -> dict:
    if prelegal_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_token(prelegal_token)
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    async with db.execute("SELECT id, email FROM users WHERE id = ?", (user_id,)) as cur:
        row = await cur.fetchone()
    if row is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return {"id": row["id"], "email": row["email"]}


CurrentUser = Annotated[dict, Depends(_get_current_user)]
