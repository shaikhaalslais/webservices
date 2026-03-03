from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# client schemas
class ClientBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    age: Optional[int] = None
    package_type: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int
    join_date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# class response schema
class ClassResponse(BaseModel):
    id: int
    name: str
    level: str
    day_of_week: str
    time: str
    duration_minutes: int
    capacity: int
    studio_id: int
    instructor_id: int
    
    class Config:
        from_attributes = True

# booking schemas
class BookingBase(BaseModel):
    client_id: int
    class_id: int
    status: Optional[str] = "confirmed"

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    booking_date: datetime
    created_at: datetime
    client: Optional[ClientResponse] = None
    pilates_class: Optional[ClassResponse] = None
    
    class Config:
        from_attributes = True
