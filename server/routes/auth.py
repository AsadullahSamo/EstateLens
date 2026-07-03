from fastapi import APIRouter, Depends

from config.database import get_db
from middlewares.auth_middleware import get_current_user
from models.user import User
from schemas.auth import (
    UserCreate,
    UserLogin,
    RefreshTokenRequest,
    UserResponse,
    AccessTokenResponse,
    TokenPairResponse
)
from controllers.auth_controller import (
    register_user,
    authenticate_user,
    refresh_access_token,
    revoke_refresh_token
)

from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(db, payload)

@router.post("/login", response_model=TokenPairResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    _, access_token, refresh_token = await authenticate_user(db, payload)
    return TokenPairResponse(access_token=access_token, refresh_token=refresh_token)

@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh(payload: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    access_token = await refresh_access_token(db, payload.refresh_token)
    return AccessTokenResponse(access_token=access_token)

@router.post("/logout", status_code=204)
async def logout(payload: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    return await revoke_refresh_token(db, payload.refresh_token)

@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

