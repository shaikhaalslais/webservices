# API Endpoints Design

## Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

## Studios (READ only for this project)
- GET /api/studios
- GET /api/studios/{id}

## Classes (Full CRUD)
- POST /api/classes (Admin only)
- GET /api/classes
- GET /api/classes/{id}
- PUT /api/classes/{id}
- DELETE /api/classes/{id}
- GET /api/classes/{id}/availability

## Bookings (Full CRUD - Your main feature!)
- POST /api/bookings
- GET /api/bookings
- GET /api/bookings/{id}
- PUT /api/bookings/{id}
- DELETE /api/bookings/{id} (Cancel)
- GET /api/clients/{id}/bookings

## Clients (CRUD)
- POST /api/clients
- GET /api/clients
- GET /api/clients/{id}
- PUT /api/clients/{id}
- DELETE /api/clients/{id}

## Advanced Analytics (Novel features!)
- GET /api/analytics/popular-classes
- GET /api/analytics/peak-times
- GET /api/analytics/retention-risk
- GET /api/analytics/revenue-forecast
- GET /api/analytics/demand-by-postcode