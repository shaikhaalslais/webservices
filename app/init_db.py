from app.database import engine, Base
from app.models import Client, Instructor, Studio, PilatesClass, Booking

# creates all tables in the database
def init_database():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_database()