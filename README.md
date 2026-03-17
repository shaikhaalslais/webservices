# On Pilates Lane — Pilates Studio Booking Platform

A full-stack web application for managing Pilates class bookings, clients, and private sessions, with an AI-powered chatbot assistant.

**Live URL:** [https://www.onpilateslane.com](https://www.onpilateslane.com)  
**API Documentation:** [https://webapp-production-45f1.up.railway.app/docs](https://webapp-production-45f1.up.railway.app/docs)  
**API Documentation:** See `API_DOCUMENTATION.pdf`  

---

## Project Overview

On Pilates Lane allows users to browse and book Pilates classes across Leeds, manage client accounts, request private sessions, and interact with an AI assistant that queries the live database in real time.

---

## Local Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip
- npm

### 1. Clone the repository
```bash
git clone https://github.com/shaikhaalslais/webservices.git
cd webservices
```

You will need 3 separate terminals running simultaneously.

### 2. Backend (FastAPI) — Terminal 1
```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Runs at `http://localhost:8000` — Swagger docs at `http://localhost:8000/docs`

### 3. Frontend (React) — Terminal 2
```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`

### 4. Chat Bridge — Terminal 3
```bash
cd chat-bridge
npm install
npm run dev
```

Runs at `http://localhost:8787`