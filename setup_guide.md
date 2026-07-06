# 🛳️ NavAIgator — Setup Guide

> **AI-Powered Maritime Route Optimization Platform**  
> This guide walks you through setting up the full NavAIgator stack (FastAPI backend + Next.js frontend) on your local machine.

---

## 📋 Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| **Python** | 3.10+ | `python --version` |
| **Node.js** | 18.0+ | `node --version` |
| **npm** | 9.0+ | `npm --version` |
| **Git** | Any | `git --version` |

---

## 📁 Repository Structure

```
NavAIgator/
├── backend/        ← FastAPI + Genetic Algorithm Engine
│   ├── main.py
│   └── requirements.txt
├── frontend/       ← Next.js 16 + React 19 Application
│   ├── app/
│   ├── components/
│   └── package.json
├── requirements.txt   ← Root-level overview
└── setup_guide.md
```

---

## ⚙️ Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd "NavAIgator - AI Powered Marinetime Route Optimization Platform"
```

---

## 🐍 Step 2 — Backend Setup (FastAPI)

### 2.1 Navigate to the Backend Directory

```bash
cd backend
```

### 2.2 Create a Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `fastapi` — Web framework
- `uvicorn[standard]` — ASGI server
- `pydantic` — Data validation
- `numpy` — Genetic algorithm computations
- `python-dotenv` — Environment variable management

### 2.4 Run the Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: **http://localhost:8000**  
Interactive API docs: **http://localhost:8000/docs**

> **Note:** The frontend is pre-configured to use the hosted API at `https://navaigator.onrender.com`. You only need to run the backend locally if you are modifying the optimization engine.

---

## ⚛️ Step 3 — Frontend Setup (Next.js)

### 3.1 Open a New Terminal and Navigate to Frontend

```bash
cd frontend
```

### 3.2 Install Node Dependencies

```bash
npm install
```

> If you prefer **yarn**:
> ```bash
> yarn install
> ```

### 3.3 Configure Environment Variables (Optional)

If connecting to a local backend instead of the hosted API:

```bash
# Create a .env.local file in /frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Point to local backend (if running Step 2 locally)
NEXT_PUBLIC_API_URL=http://localhost:8000

# OR use the hosted production backend (default)
# NEXT_PUBLIC_API_URL=https://navaigator.onrender.com
```

### 3.4 Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Step 4 — Production Build

```bash
cd frontend

# Build
npm run build

# Start production server
npm start
```

The production build will be available at **http://localhost:3000**.

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/ports` | List all available ports |
| `GET` | `/ship-types` | Ship types with specifications |
| `POST` | `/optimize` | Trigger route optimization |
| `POST` | `/simulate` | Simulate alternate conditions |
| `POST` | `/risk-analysis` | Run risk scoring for a route |

**Hosted API:** `https://navaigator.onrender.com/docs`

---

## 🔧 Development Scripts (Frontend)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build optimized production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## 🛟 Troubleshooting

### ❌ `uvicorn` not found
```bash
pip install uvicorn[standard]
```

### ❌ `npm install` fails
- Ensure Node.js 18+ is installed
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and retry: `rm -rf node_modules && npm install`

### ❌ Map not loading in browser
- Ensure JavaScript is enabled
- Check the browser's Network tab for blocked Leaflet CDN resources
- Try disabling browser extensions (especially ad blockers)

### ❌ Backend CORS error
- If running a local backend, ensure CORS is configured in `main.py` to allow `http://localhost:3000`
- Check that `NEXT_PUBLIC_API_URL` points to the correct backend address

### ❌ Theme not persisting
- Clear browser localStorage: `localStorage.clear()` in browser console
- Ensure `next-themes` is properly initialized in the root layout

---

## 🚢 Deployment

### Frontend — Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from /frontend
cd frontend
vercel
```

Set the environment variable `NEXT_PUBLIC_API_URL` in your Vercel project settings.

### Backend — Render / Railway / Fly.io

The backend is currently hosted at `https://navaigator.onrender.com`.

For self-hosting:
```bash
# Using Render
# 1. Create a new Web Service on render.com
# 2. Point to /backend directory
# 3. Build command: pip install -r requirements.txt
# 4. Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Refer to [`DEPLOYMENT.md`](./DEPLOYMENT.md) for full cloud deployment instructions.

---

## 📚 Additional Documentation

| File | Description |
|------|-------------|
| [`FEATURES.md`](./FEATURES.md) | Detailed feature breakdown |
| [`CONFIG.md`](./CONFIG.md) | Configuration options |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Cloud deployment guide |
| [`QUICK_START.md`](./QUICK_START.md) | Condensed quick start reference |
| [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) | Architecture overview |

---

## 📄 License

This project is **proprietary and confidential.**  
For support, questions, or feature requests, contact the development team.

---

<div align="center">

**NavAIgator** — *Intelligence That Knows the Way* ⚓

</div>
