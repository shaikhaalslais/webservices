from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class BookingStatus(str, enum.Enum):
    CONFIRMED = "confirmed"
    WAITLIST = "waitlist"
    CANCELLED = "cancelled"

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String)
    age = Column(Integer)
    join_date = Column(DateTime, default=datetime.utcnow)
    package_type = Column(String)  # "10-class", "monthly", etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to bookings
    bookings = relationship("Booking", back_populates="client")

class Instructor(Base):
    __tablename__ = "instructors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    certification = Column(String)  # STOTT, BASI, etc.
    specialization = Column(String)  # Reformer, Mat, etc.
    years_experience = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to classes
    classes = relationship("PilatesClass", back_populates="instructor")

class Studio(Base):
    __tablename__ = "studios"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String)
    city = Column(String, default="London")
    capacity = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to classes
    classes = relationship("PilatesClass", back_populates="studio")

class PilatesClass(Base):
    __tablename__ = "classes"
    
    id = Column(Integer, primary_key=True, index=True)
    studio_id = Column(Integer, ForeignKey("studios.id"))
    instructor_id = Column(Integer, ForeignKey("instructors.id"))
    name = Column(String, nullable=False)  # "Beginner Mat Pilates"
    description = Column(String)
    level = Column(String)  # Beginner, Intermediate, Advanced
    day_of_week = Column(String)  # Monday, Tuesday, etc.
    time = Column(String)  # "10:00"
    duration_minutes = Column(Integer, default=60)
    capacity = Column(Integer, default=12)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    studio = relationship("Studio", back_populates="classes")
    instructor = relationship("Instructor", back_populates="classes")
    bookings = relationship("Booking", back_populates="pilates_class")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    booking_date = Column(DateTime, default=datetime.utcnow)
    status = Column(SQLEnum(BookingStatus), default=BookingStatus.CONFIRMED)
    created_at = Column(DateTime, default=datetime.utcnow)
    cancelled_at = Column(DateTime, nullable=True)
    
    # Relationships
    client = relationship("Client", back_populates="bookings")
    pilates_class = relationship("PilatesClass", back_populates="bookings")