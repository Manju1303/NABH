"""
SQLAlchemy ORM Models — NABH Compliance Engine
Fixes: proper column lengths, Enum roles, email on User, AssessmentSchedule table.
"""
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, JSON,
    DateTime, ForeignKey, Enum as SAEnum, Text
)
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone


class HospitalSubmission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    submitted_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, onupdate=lambda: datetime.now(timezone.utc))

    hospital_name = Column(String(255), index=True)
    registration_number = Column(String(100), unique=True, index=True)
    contact_email = Column(String(255))
    phone = Column(String(30))

    hospital_type = Column(String(100))
    bed_capacity = Column(Integer)
    operational_beds = Column(Integer)

    score = Column(Integer)
    readiness_percentage = Column(Float)
    is_ready = Column(Boolean)

    section_scores = Column(JSON)
    deficiencies = Column(JSON)
    form_data = Column(JSON)

    remarks = relationship("Remark", back_populates="submission", cascade="all, delete-orphan")
    deadlines = relationship("RemediationDeadline", back_populates="submission", cascade="all, delete-orphan")
    remediation_steps = relationship("RemediationStep", back_populates="submission", cascade="all, delete-orphan")
    schedules = relationship("AssessmentSchedule", back_populates="submission", cascade="all, delete-orphan")


class Remark(Base):
    __tablename__ = "remarks"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    author = Column(String(255))
    role = Column(String(100))
    message = Column(Text)   # TEXT — bounded at schema/API level (max 2000 chars)
    category = Column(String(100))

    submission = relationship("HospitalSubmission", back_populates="remarks")


class RemediationDeadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    deficiency_id = Column(String(255))
    deadline = Column(DateTime)
    label = Column(String(500))
    note = Column(Text)
    set_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    set_by = Column(String(255))

    submission = relationship("HospitalSubmission", back_populates="deadlines")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, nullable=True, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)

    # FIXED: Proper Enum — prevents arbitrary role strings
    role = Column(
        SAEnum("admin", "hospital_admin", "committee", "staff", name="user_role_enum"),
        nullable=False,
        default="staff"
    )
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, onupdate=lambda: datetime.now(timezone.utc))

    # Link to hospital (for hospital_admin / staff roles)
    hospital_id = Column(Integer, ForeignKey("submissions.id"), nullable=True)
    hospital = relationship("HospitalSubmission")


class RemediationStep(Base):
    __tablename__ = "remediation"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    deficiency_id = Column(String(255))
    status = Column(String(50), default="pending")   # pending|in_progress|resolved|verified
    action_taken = Column(Text, nullable=True)
    completion_date = Column(DateTime, nullable=True)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    submission = relationship("HospitalSubmission", back_populates="remediation_steps")


class AssessmentSchedule(Base):
    """NEW: Replaces the hardcoded mock data in schedule.py (HIGH-01)."""
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=True)
    hospital_name = Column(String(255))
    date = Column(DateTime, nullable=False)
    assessment_type = Column(String(100))   # Pre-Assessment Visit | Document Verification | etc.
    assessor = Column(String(255))
    location = Column(String(100))          # On-Site | Virtual
    status = Column(String(50), default="Scheduled")  # Scheduled|Pending|Completed|Cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_by = Column(String(255))

    submission = relationship("HospitalSubmission", back_populates="schedules")
