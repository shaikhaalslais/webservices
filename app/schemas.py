from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# booking schemas
# Used for validating booking requests and formatting responses
class BookingBase(BaseModel):
    client_id: int #must be a number
    class_id: int #must be a number
    status: Optional[str] = "confirmed" #must be a text

# schema used when creating a new booking
class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    booking_date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


# client schemas
class ClientBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    age: Optional[int] = None
    package_type: Optional[str] = None

class ClientCreate(ClientBase):
    pass

# Schema returned in API responses for clients
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