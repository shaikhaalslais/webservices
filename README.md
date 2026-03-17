# On Pilates Lane — Pilates Studio Booking Platform

A full-stack web application for managing Pilates class bookings, clients, and private sessions, with an AI-powered chatbot assistant.

**Live URL:** [https://www.onpilateslane.com](https://www.onpilateslane.com)  
**API Documentation:** [https://webapp-production-45f1.up.railway.app/docs](https://webapp-production-45f1.up.railway.app/docs)  
**API Documentation PDF:** See `API_DOCUMENTATION.pdf`  

---

## Project Overview

On Pilates Lane allows users to browse and book Pilates classes across Leeds, manage client accounts, request private sessions, and interact with an AI assistant that queries the live database in real time.

---

## Deployment

The application is fully deployed and live at [https://www.onpilateslane.com](https://www.onpilateslane.com), running across four separate services on Railway:

| Service | URL |
|---------|-----|
| Frontend | https://www.onpilateslane.com |
| Backend API | https://webapp-production-45f1.up.railway.app |
| API Docs | https://webapp-production-45f1.up.railway.app/docs |

---

**Dataset:** Leeds Leisure Centres and Classes — [https://www.data.gov.uk/dataset/b90c3b47-3001-45a3-ae57-271ba4df065c/leeds-leisure-centres-and-classes](https://www.data.gov.uk/dataset/b90c3b47-3001-45a3-ae57-271ba4df065c/leeds-leisure-centres-and-classes)

## Local Setup Instructions

To run the project locally, you will need 3 separate terminals running simultaneously.

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