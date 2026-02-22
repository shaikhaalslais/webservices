from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models import Booking, Client, PilatesClass
from app.schemas import BookingResponse, BookingCreate, ClientResponse, ClientCreate, ClassResponse

router = APIRouter(prefix="/api", tags=["Bookings API"])

# booking endpoints (CRUD)

# get all bookings
@router.get("/bookings", response_model=List[BookingResponse])
def get_all_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return bookings

 # get a specific booking by ID
@router.get("/bookings/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found"
        )
    return booking

# creates a new booking so it checks if client exists and class exists
@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)): 
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

# update an existing booking
@router.put("/bookings/{booking_id}", response_model=BookingResponse)
def update_booking(booking_id: int, booking_update: BookingCreate, db: Session = Depends(get_db)):

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

# delete booking
@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):

    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found"
        )
    
    db.delete(booking)
    db.commit()
    return None


# Class endpoints

# get all pilates classes
@router.get("/classes", response_model=List[ClassResponse])
def get_all_classes(db: Session = Depends(get_db)):
    classes = db.query(PilatesClass).all()
    return classes

# check how many spots are available in a class
# returns: capacity, booked count, and available spots
@router.get("/classes/{class_id}/availability")
def check_class_availability(class_id: int, db: Session = Depends(get_db)):
    
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


# client endpoints (CRUD)

# create a new client
@router.post("/clients", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
   
    # Check if email already exists
    existing_client = db.query(Client).filter(Client.email == client.email).first()
    if existing_client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Client with email {client.email} already exists"
        )
    
    # Create new client
    new_client = Client(**client.dict())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    
    return new_client


# read a specific client by ID
@router.get("/clients/{client_id}", response_model=ClientResponse)
def get_client(client_id: int, db: Session = Depends(get_db)):
  
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with id {client_id} not found"
        )
    return client

# read all clients
@router.get("/clients", response_model=List[ClientResponse])
def get_all_clients(db: Session = Depends(get_db)):

    clients = db.query(Client).all()
    return clients


# update an existing client
@router.put("/clients/{client_id}", response_model=ClientResponse)
def update_client(client_id: int, client_update: ClientCreate, db: Session = Depends(get_db)):

    # Find the client
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with id {client_id} not found"
        )
    
    # Check if new email conflicts with another client
    if client_update.email != client.email:
        existing = db.query(Client).filter(
            Client.email == client_update.email,
            Client.id != client_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email {client_update.email} already in use by another client"
            )
    
    # Update fields
    client.name = client_update.name
    client.email = client_update.email
    client.phone = client_update.phone
    client.age = client_update.age
    client.package_type = client_update.package_type
    
    db.commit()
    db.refresh(client)
    return client


# delete a client
@router.delete("/clients/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with id {client_id} not found"
        )
    
    db.delete(client)
    db.commit()
    return None