from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class HospitalSubmission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
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

class Remark(Base):
    __tablename__ = "remarks"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    date = Column(DateTime, default=datetime.utcnow)
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
    set_at = Column(DateTime, default=datetime.utcnow)
    set_by = Column(String)

    submission = relationship("HospitalSubmission", back_populates="deadlines")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # admin, hospital_admin
