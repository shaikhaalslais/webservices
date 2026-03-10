from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Literal
from app.database import get_db
from app.models import Booking, Client, PilatesClass, PrivateSessionRequest, Studio
from app.schemas import BookingResponse, BookingCreate, ClientResponse, ClientCreate, ClassResponse, PrivateSessionResponse, PrivateSessionCreate


# Protected router — requires authentication
router = APIRouter(
    prefix="/api",
    dependencies=[Depends(get_current_user)],
)

# Public router — no authentication required
public_router = APIRouter(prefix="/api")


# Booking endpoints (CRUD) — protected

@router.get("/bookings", response_model=List[BookingResponse], status_code=status.HTTP_200_OK)
def get_all_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).all()

@router.get("/bookings/{booking_id}", response_model=BookingResponse, status_code=status.HTTP_200_OK)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Booking with id {booking_id} not found")
    return booking

@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == booking.client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Client with id {booking.client_id} not found")

    pilates_class = db.query(PilatesClass).filter(PilatesClass.id == booking.class_id).first()
    if not pilates_class:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Class with id {booking.class_id} not found")

    booked_count = db.query(func.count(Booking.id)).filter(
        Booking.class_id == booking.class_id,
        Booking.status == "confirmed"
    ).scalar() or 0

    if booked_count >= pilates_class.capacity:
        booking.status = "waitlist"

    new_booking = Booking(**booking.dict())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@router.put("/bookings/{booking_id}", response_model=BookingResponse, status_code=status.HTTP_200_OK)
def update_booking(booking_id: int, booking_update: BookingCreate, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Booking with id {booking_id} not found")

    client = db.query(Client).filter(Client.id == booking_update.client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Client with id {booking_update.client_id} not found")

    pilates_class = db.query(PilatesClass).filter(PilatesClass.id == booking_update.class_id).first()
    if not pilates_class:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Class with id {booking_update.class_id} not found")

    booking.client_id = booking_update.client_id
    booking.class_id = booking_update.class_id
    booking.status = booking_update.status
    db.commit()
    db.refresh(booking)
    return booking

@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Booking with id {booking_id} not found")
    db.delete(booking)
    db.commit()
    return None


# Class endpoints — public (anyone can view classes and availability)

@public_router.get("/classes", response_model=List[ClassResponse], status_code=status.HTTP_200_OK)
def get_all_classes(db: Session = Depends(get_db)):
    return db.query(PilatesClass).all()

@public_router.get("/classes/{class_id}/availability", status_code=status.HTTP_200_OK)
def check_class_availability(class_id: int, db: Session = Depends(get_db)):
    pilates_class = db.query(PilatesClass).filter(PilatesClass.id == class_id).first()
    if not pilates_class:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Class with id {class_id} not found")

    booked_count = db.query(func.count(Booking.id)).filter(
        Booking.class_id == class_id,
        Booking.status == "confirmed"
    ).scalar() or 0

    available = pilates_class.capacity - booked_count
    return {
        "class_id": class_id,
        "class_name": pilates_class.name,
        "capacity": pilates_class.capacity,
        "booked": booked_count,
        "available_spots": max(available, 0),
        "is_full": available <= 0
    }


# Client endpoints (CRUD) — protected

@router.post("/clients", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    existing_client = db.query(Client).filter(Client.email == client.email).first()
    if existing_client:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Client with email {client.email} already exists")
    new_client = Client(**client.dict())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client

@router.get("/clients/{client_id}", response_model=ClientResponse, status_code=status.HTTP_200_OK)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Client with id {client_id} not found")
    return client

@public_router.get("/clients", response_model=List[ClientResponse], status_code=status.HTTP_200_OK)
def get_all_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@router.put("/clients/{client_id}", response_model=ClientResponse, status_code=status.HTTP_200_OK)
def update_client(client_id: int, client_update: ClientCreate, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Client with id {client_id} not found")

    if client_update.email != client.email:
        existing = db.query(Client).filter(Client.email == client_update.email, Client.id != client_id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Email {client_update.email} already in use by another client")

    client.name = client_update.name
    client.email = client_update.email
    client.phone = client_update.phone
    client.age = client_update.age
    client.package_type = client_update.package_type
    db.commit()
    db.refresh(client)
    return client

@router.delete("/clients/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Client with id {client_id} not found")
    db.delete(client)
    db.commit()
    return None


# Private session endpoints — POST is public (anyone can request), admin endpoints protected

@public_router.post("/private-sessions", response_model=PrivateSessionResponse, status_code=status.HTTP_201_CREATED)
def create_private_session_request(session: PrivateSessionCreate, db: Session = Depends(get_db)):
    new_request = PrivateSessionRequest(**session.dict())
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/private-sessions", response_model=List[PrivateSessionResponse], status_code=status.HTTP_200_OK)
def get_all_private_sessions(db: Session = Depends(get_db)):
    return db.query(PrivateSessionRequest).all()

@router.get("/private-sessions/{request_id}", response_model=PrivateSessionResponse, status_code=status.HTTP_200_OK)
def get_private_session(request_id: int, db: Session = Depends(get_db)):
    request = db.query(PrivateSessionRequest).filter(PrivateSessionRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Private session request with id {request_id} not found")
    return request

@router.put("/private-sessions/{request_id}", response_model=PrivateSessionResponse, status_code=status.HTTP_200_OK)
def update_private_session_status(request_id: int, status_update: Literal["pending", "confirmed", "cancelled"], db: Session = Depends(get_db)):
    request = db.query(PrivateSessionRequest).filter(PrivateSessionRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Private session request with id {request_id} not found")
    request.status = status_update
    db.commit()
    db.refresh(request)
    return request

@router.delete("/private-sessions/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_private_session(request_id: int, db: Session = Depends(get_db)):
    request = db.query(PrivateSessionRequest).filter(PrivateSessionRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Private session request with id {request_id} not found")
    db.delete(request)
    db.commit()
    return None


# Studios endpoint — public

@public_router.get("/studios", status_code=status.HTTP_200_OK)
def get_all_studios(db: Session = Depends(get_db)):
    return db.query(Studio).all()