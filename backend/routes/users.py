from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models, schemas, database, auth

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("/create-member", response_model=schemas.UserOut)
async def create_user_member(
    user_in: schemas.UserCreate, 
    role: str = "committee", # "committee" or "hospital_admin"
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Only Admin can create users
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create members")
    
    # Check if hospital exists for hospital_admin role
    if role == "hospital_admin" and user_in.hospital_id:
        result = await db.execute(select(models.HospitalSubmission).filter(models.HospitalSubmission.id == user_in.hospital_id))
        if not result.scalars().first():
            raise HTTPException(status_code=404, detail="Hospital not found")
    
    # Check username
    existing = await db.execute(select(models.User).filter(models.User.username == user_in.username))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Username taken")
    
    new_user = models.User(
        username=user_in.username,
        hashed_password=auth.get_password_hash(user_in.password),
        role=role,
        hospital_id=user_in.hospital_id if role == "hospital_admin" else None
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
