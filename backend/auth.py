from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models, schemas, database

import os

# ── Security Configuration ──
SECRET_KEY = os.getenv("SECRET_KEY")
IS_PRODUCTION = os.getenv("RENDER", "") != ""

if not SECRET_KEY:
    if IS_PRODUCTION:
        raise RuntimeError(
            "CRITICAL ERROR: SECRET_KEY environment variable is NOT set in production!\n"
            "Please set the SECRET_KEY variable in your Render dashboard before deploying.\n"
            "Generate a secure key with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
        )
    # Development fallback
    SECRET_KEY = "nabh_dev_key_change_me"
    import warnings
    warnings.warn("WARNING: Using development SECRET_KEY. Never use in production!")

# Check key strength
if IS_PRODUCTION and len(SECRET_KEY) < 32:
    import warnings
    warnings.warn("SECURITY WARNING: SECRET_KEY is shorter than 32 characters. Use a stronger key!")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 # Reduced from 600 to 60 for security

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
        
    result = await db.execute(select(models.User).filter(models.User.username == token_data.username))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# ... (existing imports and config) ...

async def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    return current_user

# ── Login Endpoint ──
from fastapi import APIRouter
router = APIRouter(tags=["Authentication"])

@router.post("/api/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(select(models.User).filter(models.User.username == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
