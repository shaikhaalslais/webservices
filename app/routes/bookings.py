from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models import Booking, Client, PilatesClass
from app.schemas import BookingResponse, BookingCreate, ClientResponse, ClassResponse

router = APIRouter(prefix="/api", tags=["Bookings API"])

# ============================================
# BOOKING ENDPOINTS (CRUD)
# ============================================

@router.get("/bookings", response_model=List[BookingResponse])
def get_all_bookings(db: Session = Depends(get_db)):
    """
    Get all bookings
    Returns: List of all bookings in the system
    """
    bookings = db.query(Booking).all()
    return bookings


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    Get a specific booking by ID
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found"
        )
    return booking


@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    """
    Create a new booking
    Validates that client and class exist
    """
    # Check if client exists
    client = db.query(Client).filter(Client.id == booking.client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with id {booking.client_id} not found"
        )
    
    # Check if class exists
    pilates_class = db.query(PilatesClass).filter(PilatesClass.id == booking.class_id).first()
    if not pilates_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Class with id {booking.class_id} not found"
        )
    
    # Check if class is full
    booked_count = db.query(func.count(Booking.id)).filter(
        Booking.class_id == booking.class_id,
        Booking.status == "confirmed"
    ).scalar()
    
    if booked_count >= pilates_class.capacity:
        # Auto-set to waitlist if full
        booking.status = "waitlist"
    
    # Create booking
    new_booking = Booking(**booking.dict())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking


@router.put("/bookings/{booking_id}", response_model=BookingResponse)
def update_booking(booking_id: int, booking_update: BookingCreate, db: Session = Depends(get_db)):
    """
    Update an existing booking
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found"
        )
    
    # Update fields
    booking.client_id = booking_update.client_id
    booking.class_id = booking_update.class_id
    booking.status = booking_update.status
    
    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    Delete (cancel) a booking
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found"
        )
    
    db.delete(booking)
    db.commit()
    return None


# ============================================
# CLASS ENDPOINTS
# ============================================

@router.get("/classes", response_model=List[ClassResponse])
def get_all_classes(db: Session = Depends(get_db)):
    """
    Get all Pilates classes
    """
    classes = db.query(PilatesClass).all()
    return classes


@router.get("/classes/{class_id}/availability")
def check_class_availability(class_id: int, db: Session = Depends(get_db)):
    """
    Check how many spots are available in a class
    Returns: capacity, booked count, and available spots
    """
    pilates_class = db.query(PilatesClass).filter(PilatesClass.id == class_id).first()
    if not pilates_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Class with id {class_id} not found"
        )
    
    # Count confirmed bookings
    booked_count = db.query(func.count(Booking.id)).filter(
        Booking.class_id == class_id,
        Booking.status == "confirmed"
    ).scalar()
    
    available = pilates_class.capacity - booked_count
    
    return {
        "class_id": class_id,
        "class_name": pilates_class.name,
        "capacity": pilates_class.capacity,
        "booked": booked_count,
        "available_spots": available,
        "is_full": available <= 0
    }


# ============================================
# CLIENT ENDPOINTS
# ============================================

@router.get("/clients", response_model=List[ClientResponse])
def get_all_clients(db: Session = Depends(get_db)):
    """
    Get all clients
    """
    clients = db.query(Client).all()
    return clients


@router.get("/clients/{client_id}/bookings", response_model=List[BookingResponse])
def get_client_bookings(client_id: int, db: Session = Depends(get_db)):
    """
    Get all bookings for a specific client
    """
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with id {client_id} not found"
        )
    
    bookings = db.query(Booking).filter(Booking.client_id == client_id).all()
    return bookings