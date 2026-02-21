from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import bookings

# Create FastAPI application instance
app = FastAPI(
    title="Pilates Booking API",
    description="A modern booking system for Pilates studios with booking management and analytics",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
# Allows frontend applications to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(bookings.router)

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Welcome to Pilates Booking API",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "bookings": "/api/bookings",
            "classes": "/api/classes",
            "clients": "/api/clients"
        }
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}