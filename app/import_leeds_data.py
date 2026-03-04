import pandas as pd
import random
from datetime import datetime, timedelta, timezone
from app.database import SessionLocal
from app.models import Studio, Client, Instructor, PilatesClass, Booking, BookingStatus

def import_all_leeds_data():
    # Load the full CSV
    df = pd.read_csv('data/leeds_leisure_centres.csv')
        
    # Get database session
    db = SessionLocal()
    
    # Clear existing studios
    db.query(Studio).delete()
    
    # Import all facilities
    count = 0
    for idx, row in df.iterrows():
        studio = Studio(
            name=row['leisureCentre'],
            address=f"{row['addressLine1']}, {row.get('addressLine2', '')}".strip(', '),
            city="Leeds",
            capacity=12  # Standard Pilates class size
        )
        db.add(studio)
        count += 1

    db.commit()
    db.close()
    
# generate 50 clients with UK demographics
def generate_clients():

    db = SessionLocal()
    db.query(Client).delete()
    
    first_names = ['Emily', 'Sarah', 'Jessica', 'Sophie', 'Emma', 'Olivia', 
                'James', 'Oliver', 'George', 'Harry', 'Jack', 'Charlie']
    last_names = ['Smith', 'Jones', 'Williams', 'Taylor', 'Brown', 'Davies']
    
    for i in range(50):
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        client = Client(
            name=name,
            email=f"{name.lower().replace(' ', '.')}+{i}@email.com",
            phone=f"0113{random.randint(3000000, 3999999)}",
            age=random.randint(25, 60),
            package_type=random.choice(['10-class', 'monthly', 'drop-in']),
            join_date=datetime.now(timezone.utc) - timedelta(days=random.randint(30, 365))        )
        db.add(client)
    
    db.commit()
    db.close()


# generate 5 instructors
def generate_instructors():
    
    db = SessionLocal()
    db.query(Instructor).delete()
    
    instructors = [
        Instructor(name="Emma Williams", email="emma@leedspilates.co.uk", 
                certification="STOTT", specialization="Reformer", years_experience=8),
        Instructor(name="Sarah Thompson", email="sarah@leedspilates.co.uk",
                certification="BASI", specialization="Mat", years_experience=5),
        Instructor(name="Lisa Martinez", email="lisa@leedspilates.co.uk",
                certification="Peak Pilates", specialization="Prenatal", years_experience=10),
        Instructor(name="Rachel Green", email="rachel@leedspilates.co.uk",
                certification="Polestar", specialization="Clinical", years_experience=6),
        Instructor(name="Hannah Brown", email="hannah@leedspilates.co.uk",
                certification="Body Control", specialization="Tower", years_experience=7)
    ]
    
    for instructor in instructors:
        db.add(instructor)
    
    db.commit()
    db.close()

# generate classes
def generate_classes():
    db = SessionLocal()
    db.query(PilatesClass).delete()
    
    studios = db.query(Studio).all()
    instructors = db.query(Instructor).all()
    
    # ONLY 4 classes total 
    classes_data = [
        {
            "name": "Beginner Mat",
            "description": "Perfect for those new to Pilates. Focus on foundational movements and core strength.",
            "level": "Beginner",
            "day_of_week": "Friday",
            "time": "06:30",
            "duration_minutes": 60,
            "capacity": 12,
            "studio_id": studios[0].id if studios else 1,
            "instructor_id": instructors[0].id if instructors else 1
        },
        {
            "name": "Intermediate Mat",
            "description": "Build on the basics with more challenging mat exercises and flowing sequences.",
            "level": "Intermediate",
            "day_of_week": "Wednesday",
            "time": "10:00",
            "duration_minutes": 60,
            "capacity": 10,
            "studio_id": studios[1].id if len(studios) > 1 else 1,
            "instructor_id": instructors[1].id if len(instructors) > 1 else 1
        },
        {
            "name": "Beginner Reformer",
            "description": "Introduction to the Reformer machine with guided, supported movements.",
            "level": "Beginner",
            "day_of_week": "Monday",
            "time": "09:00",
            "duration_minutes": 50,
            "capacity": 8,
            "studio_id": studios[2].id if len(studios) > 2 else 1,
            "instructor_id": instructors[2].id if len(instructors) > 2 else 1
        },
        {
            "name": "Intermediate Reformer",
            "description": "Dynamic Reformer sequences for those comfortable with the equipment.",
            "level": "Intermediate",
            "day_of_week": "Thursday",
            "time": "18:00",
            "duration_minutes": 50,
            "capacity": 8,
            "studio_id": studios[3].id if len(studios) > 3 else 1,
            "instructor_id": instructors[3].id if len(instructors) > 3 else 1
        }
    ]
    
    for class_info in classes_data:
        pilates_class = PilatesClass(**class_info)
        db.add(pilates_class)
    
    db.commit()
    db.close()

# generate booking
def generate_bookings():       
    db = SessionLocal()
    db.query(Booking).delete()
    
    clients = db.query(Client).all()
    classes = db.query(PilatesClass).all()
    
    count = 0
    for pilates_class in classes:
        num_bookings = int(pilates_class.capacity * 0.75)  # 75% full
        selected = random.sample(clients, min(num_bookings, len(clients)))
        
        for client in selected:
            rand = random.random()
            if rand < 0.92:
                status = BookingStatus.CONFIRMED
            elif rand < 0.97:
                status = BookingStatus.WAITLIST
            else:
                status = BookingStatus.CANCELLED
            
            booking = Booking(
                client_id=client.id,
                class_id=pilates_class.id,
                status=status,
                booking_date=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30))
            )
            db.add(booking)
            count += 1
    
    db.commit()
    db.close()

def main():
    print("importing data complete")
    
    import_all_leeds_data()
    generate_clients()
    generate_instructors()
    generate_classes()
    generate_bookings()

if __name__ == "__main__":
    main()

