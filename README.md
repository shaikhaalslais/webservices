# On Pilates Lane — Web Services API

**Coursework 1: Individual Web Services API Development Project**  
**Author:** Shaikha Al Slais

---

## Project Overview

On Pilates Lane (OPL) is a full-stack web application for a boutique Pilates studio based in Leeds, UK. The system provides a public-facing website with class schedules, private session booking, and an AI-powered chatbot assistant, alongside a protected staff dashboard for managing clients and bookings.

The backend is built as a RESTful API using FastAPI (Python), with a React/Vite frontend and a separate MCP-based chatbot service.

---

## Running the Project

This project is intended to be run inside a **GitHub Codespace**. All required dependencies (Python, Node.js, Git) are pre-installed in the Codespace environment. No local installation is required.

---

## Project Structure

```
webapp/
├── frontend/        # React + Vite frontend
├── backend/         # FastAPI backend (port 8000)
├── mcp/             # MCP chatbot server
├── chat-bridge/     # Chatbot bridge service (port 8787)
└── venv/            # Python virtual environment
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd webapp
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt


# Start the backend server
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`.

### 3. Chatbot Bridge Setup

In a new terminal:

```bash
source venv/bin/activate
cd chat-bridge
npm run dev
```

The chatbot service will be available at `http://localhost:8787`.

### 4. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Staff Login

The admin dashboard (Clients and Bookings pages) requires authentication. Use the following credentials:

| Field    | Value                        |
|----------|------------------------------|
| Email    | bibi@onpilateslane.co.uk     |
| Password | pilates2026                  |

---

## API Documentation

The API is documented using the OpenAPI standard and is accessible once the backend is running.

**Interactive API Docs (Swagger UI):** `http://localhost:8000/docs`

The API documentation has also been exported as a PDF and is included in the root of this repository:

📄 `api-documentation.pdf`

---

## Key Features

- **Class Schedule** — Browse and book group Pilates classes by location
- **Private Sessions** — Submit booking requests for one-to-one sessions
- **Client Management** — Staff can add, edit, view, and delete client records
- **Bookings Management** — Staff can confirm, cancel, and delete bookings
- **Waitlist System** — Automatic waitlist when a class reaches capacity
- **AI Chatbot** — MCP-powered assistant for studio and booking queries
- **Authentication** — JWT-based staff login with protected routes

---

## Running All Services (Summary)

| Service         | Command                        | Port  |
|-----------------|--------------------------------|-------|
| Backend API     | `uvicorn main:app --reload`    | 8000  |
| Chatbot Bridge  | `npm run dev`                  | 8787  |
| Frontend        | `npm run dev`                  | 5173  |