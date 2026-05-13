"""
routes/users.py
Fixes:
  CRIT-07: Replace raw dict with typed UserUpdate schema
  NEW: Full role-based staff management — admin can create/list/update/delete staff
       with password reset capability
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models, schemas, database, auth

router = APIRouter(prefix="/api/users", tags=["User Management"])


# ─── Current User ────────────────────────────────────────────
@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@router.post("/me/change-password")
async def change_own_password(
    payload: schemas.SelfPasswordUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Any logged-in user can change their own password."""
    if not auth.verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.hashed_password = auth.get_password_hash(payload.new_password)
    db.add(current_user)
    await db.commit()
    return {"message": "Password updated successfully"}


# ─── Admin: List All Users ────────────────────────────────────
@router.get("", response_model=list[schemas.UserOut])
async def list_users(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    result = await db.execute(select(models.User).order_by(models.User.created_at.desc()))
    return result.scalars().all()


# ─── Admin: Create Staff / Committee / Hospital Admin ─────────
@router.post("/create", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: schemas.UserCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    """Admin creates a new staff, committee, or hospital_admin account."""
    # Check username uniqueness
    existing = await db.execute(select(models.User).filter(models.User.username == user_in.username))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Check email uniqueness if provided
    if user_in.email:
        email_check = await db.execute(select(models.User).filter(models.User.email == user_in.email))
        if email_check.scalars().first():
            raise HTTPException(status_code=400, detail="Email already in use")

    # Validate hospital_id if provided
    if user_in.hospital_id:
        hosp = await db.execute(
            select(models.HospitalSubmission).filter(models.HospitalSubmission.id == user_in.hospital_id)
        )
        if not hosp.scalars().first():
            raise HTTPException(status_code=404, detail="Hospital not found")

    new_user = models.User(
        username=user_in.username,
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=auth.get_password_hash(user_in.password),
        role=user_in.role,
        hospital_id=user_in.hospital_id,
        is_active=True,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


# ─── Admin: Get Specific User ─────────────────────────────────
@router.get("/{user_id}", response_model=schemas.UserOut)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ─── Admin: Update User Profile / Role / Status ───────────────
@router.patch("/{user_id}", response_model=schemas.UserOut)
async def update_user(
    user_id: int,
    # CRIT-07 FIX: Typed schema instead of raw dict
    user_update: schemas.UserUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    """Admin updates a user's role, status, email, or hospital assignment."""
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent admin from demoting themselves
    if user.id == current_user.id and user_update.role and user_update.role != "admin":
        raise HTTPException(status_code=400, detail="Cannot change your own role")

    if user_update.email is not None:
        email_check = await db.execute(
            select(models.User).filter(models.User.email == user_update.email, models.User.id != user_id)
        )
        if email_check.scalars().first():
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = user_update.email

    if user_update.full_name is not None:
        user.full_name = user_update.full_name
    if user_update.role is not None:
        user.role = user_update.role
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    if user_update.hospital_id is not None:
        user.hospital_id = user_update.hospital_id

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# ─── Admin: Reset User Password ───────────────────────────────
@router.post("/{user_id}/reset-password")
async def reset_user_password(
    user_id: int,
    payload: schemas.PasswordUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    """Admin resets any user's password."""
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = auth.get_password_hash(payload.new_password)
    db.add(user)
    await db.commit()
    return {"message": f"Password reset successfully for user: {user.username}"}


# ─── Admin: Delete User ───────────────────────────────────────
@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    """Admin deletes a user account. Cannot delete own account."""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
    return {"message": f"User {user.username} deleted successfully"}
