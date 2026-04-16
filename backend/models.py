from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class HospitalSubmission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, onupdate=lambda: datetime.now(timezone.utc))
    
    hospital_name = Column(String, index=True)
    registration_number = Column(String, unique=True, index=True)
    contact_email = Column(String)
    phone = Column(String)
    
    hospital_type = Column(String)
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

class Remark(Base):
    __tablename__ = "remarks"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    author = Column(String)
    role = Column(String)
    message = Column(String)
    category = Column(String)

    submission = relationship("HospitalSubmission", back_populates="remarks")

class RemediationDeadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    deficiency_id = Column(String)
    deadline = Column(DateTime)
    label = Column(String)
    note = Column(String)
    set_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    set_by = Column(String)

    submission = relationship("HospitalSubmission", back_populates="deadlines")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # admin, hospital_admin
    
    # Link to the hospital they manage (only for hospital_admin role)
    hospital_id = Column(Integer, ForeignKey("submissions.id"), nullable=True)
    
    hospital = relationship("HospitalSubmission")

class RemediationStep(Base):
    __tablename__ = "remediation"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    deficiency_id = Column(String)
    
    status = Column(String, default="pending") # pending, in_progress, resolved, verified
    action_taken = Column(String, nullable=True)
    completion_date = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    submission = relationship("HospitalSubmission", back_populates="remediation_steps")
