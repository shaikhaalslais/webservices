# Pilates Booking API - Data Model Design

## Core Entities

### 1. Studio
- id (PK)
- name
- address
- postcode (from real UK data)
- borough
- capacity
- created_at

### 2. Instructor
- id (PK)
- name
- email
- certification (STOTT, BASI, etc.)
- specialization
- years_experience
- bio
- created_at

### 3. Client
- id (PK)
- name
- email
- phone
- age
- postcode
- persona_type (AI-generated: "busy_professional", "wellness_enthusiast", etc.)
- join_date
- package_type
- created_at

### 4. Class
- id (PK)
- studio_id (FK)
- instructor_id (FK)
- name (Mat Pilates, Reformer, etc.)
- description
- level (Beginner, Intermediate, Advanced)
- day_of_week
- time
- duration_minutes
- capacity
- created_at

### 5. Booking
- id (PK)
- client_id (FK)
- class_id (FK)
- booking_date
- status (confirmed, waitlist, cancelled)
- created_at
- cancelled_at

### 6. Review (Optional - for advanced features)
- id (PK)
- client_id (FK)
- class_id (FK)
- rating (1-5)
- comment
- created_at