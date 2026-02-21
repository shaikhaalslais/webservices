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
    
    studios = db.query(Studio).all()  # Get ALL studios
    instructors = db.query(Instructor).all()
    
    class_types = [
        {"name": "Beginner Mat", "level": "Beginner", "duration": 60, "capacity": 12},
        {"name": "Intermediate Reformer", "level": "Intermediate", "duration": 50, "capacity": 8},
        {"name": "Advanced Core", "level": "Advanced", "duration": 60, "capacity": 10},
    ]
    
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    times = ["06:30", "12:00", "18:00"]
    
    count = 0
    # Give EVERY studio 3 classes (one of each type)
    for studio in studios:  # ALL studios now!
        for class_type in class_types:
            pilates_class = PilatesClass(
                studio_id=studio.id,
                instructor_id=instructors[count % len(instructors)].id,
                name=class_type["name"],
                level=class_type["level"],
                day_of_week=days[count % len(days)],
                time=times[count % len(times)],
                duration_minutes=class_type["duration"],
                capacity=class_type["capacity"]
            )
            db.add(pilates_class)
            count += 1
    
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

