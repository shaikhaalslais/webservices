from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import bookings
from app.routes import auth_routes
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="Pilates Booking API",
    description="A modern booking system for Pilates studios with booking management and analytics",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bookings.router)
app.include_router(auth_routes.router)
app.include_router(bookings.public_router) 

@app.get("/")
def root():
    return {
        "message": "Welcome to Pilates Booking API",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "bookings": "/api/bookings",
            "classes": "/api/classes",
            "clients": "/api/clients",
            "auth": "/api/auth"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}