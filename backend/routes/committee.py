from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models, schemas, database

router = APIRouter(prefix="/api/committee", tags=["committee"])

@router.get("")
async def get_decisions(db: AsyncSession = Depends(database.get_db)):
    # Placeholder for now
    return []
