from fastapi import APIRouter, HTTPException, Response, status

from prelegal.core.config import settings
from prelegal.core.security import create_access_token, hash_password, verify_password
from prelegal.dependencies import CurrentUser, DB
from prelegal.models.user import SigninRequest, SignupRequest, UserResponse
from prelegal.services.auth_service import create_user, find_user_by_email

router = APIRouter(prefix="/api/auth", tags=["auth"])

_COOKIE_MAX_AGE = settings.jwt_expire_days * 24 * 60 * 60


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.cookie_name,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=_COOKIE_MAX_AGE,
    )


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest, response: Response, db: DB):
    user = await create_user(db, body.email, hash_password(body.password))
    _set_auth_cookie(response, create_access_token(user["id"], user["email"]))
    return UserResponse(**user)


@router.post("/signin", response_model=UserResponse)
async def signin(body: SigninRequest, response: Response, db: DB):
    user = await find_user_by_email(db, body.email)
    if user is None or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    _set_auth_cookie(response, create_access_token(user["id"], user["email"]))
    return UserResponse(id=user["id"], email=user["email"])


@router.post("/signout", status_code=status.HTTP_204_NO_CONTENT)
async def signout(response: Response):
    response.delete_cookie(settings.cookie_name, httponly=True, samesite="lax", secure=False)


@router.get("/me", response_model=UserResponse)
async def me(current_user: CurrentUser):
    return UserResponse(**current_user)
