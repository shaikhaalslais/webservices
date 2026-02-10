from app.database import SessionLocal
from app.models import Client, Instructor, Studio, PilatesClass, Booking, BookingStatus
from datetime import datetime, timedelta
import random

def seed_data():
    db = SessionLocal()
    
    # Clear existing data
    db.query(Booking).delete()
    db.query(PilatesClass).delete()
    db.query(Client).delete()
    db.query(Instructor).delete()
    db.query(Studio).delete()
    
    # Create Studios
    studios = [
        Studio(name="Core Flow Pilates Studio", address="123 High St", city="London", capacity=12),
        Studio(name="London Reformer Centre", address="456 King's Rd", city="London", capacity=10),
        Studio(name="Zenith Pilates & Wellness", address="789 Oxford St", city="London", capacity=15),
    ]
    db.add_all(studios)
    db.commit()
    
    # Create Instructors
    instructors = [
        Instructor(name="Emma Williams", email="emma@studio.com", certification="STOTT", specialization="Reformer", years_experience=8),
        Instructor(name="Sarah Thompson", email="sarah@studio.com", certification="BASI", specialization="Mat", years_experience=5),
        Instructor(name="Lisa Martinez", email="lisa@studio.com", certification="Peak Pilates", specialization="Prenatal", years_experience=10),
    ]
    db.add_all(instructors)
    db.commit()
    
    # Create Classes
    classes = [
        PilatesClass(studio_id=1, instructor_id=1, name="Beginner Mat Pilates", level="Beginner", day_of_week="Monday", time="10:00", capacity=12),
        PilatesClass(studio_id=1, instructor_id=2, name="Intermediate Reformer", level="Intermediate", day_of_week="Monday", time="14:00", capacity=10),
        PilatesClass(studio_id=2, instructor_id=3, name="Advanced Core Flow", level="Advanced", day_of_week="Tuesday", time="18:00", capacity=8),
    ]
    db.add_all(classes)
    db.commit()
    
    # Create Clients
    clients = [
        Client(name="Alice Johnson", email="alice@email.com", phone="07700900001", age=28, package_type="10-class"),
        Client(name="Bob Smith", email="bob@email.com", phone="07700900002", age=35, package_type="monthly"),
        Client(name="Charlie Davis", email="charlie@email.com", phone="07700900003", age=42, package_type="drop-in"),
    ]
    db.add_all(clients)
    db.commit()
    
    # Create Bookings
    bookings = [
        Booking(client_id=1, class_id=1, status=BookingStatus.CONFIRMED),
        Booking(client_id=2, class_id=2, status=BookingStatus.CONFIRMED),
        Booking(client_id=3, class_id=3, status=BookingStatus.WAITLIST),
    ]
    db.add_all(bookings)
    db.commit()
    
    print("✅ Database seeded with sample data!")
    print(f"   - {len(studios)} studios")
    print(f"   - {len(instructors)} instructors")
    print(f"   - {len(classes)} classes")
    print(f"   - {len(clients)} clients")
    print(f"   - {len(bookings)} bookings")
    
    db.close()

if __name__ == "__main__":
    seed_data()