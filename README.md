<p align="center">
  <img src="./assets/ship_banner.svg" width="900" alt="NavAIgator ship animation"/>
</p>

<p align="center">
  <img src="./assets/title_banner.svg" width="900" alt="NavAIgator title"/>
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)

</p>

---

## 🧭 Overview

NavAIgator is a professional, **AI-powered maritime route optimization platform** built with Next.js and React. It uses **genetic algorithms** to generate optimal shipping routes that intelligently balance time, fuel cost, and safety considerations — making it the smartest navigator on the seas.

> **Live API:** `https://navaigator.onrender.com`

---

## ✨ Features

### 🧬 Core Optimization
- **Genetic Algorithm Engine** — Advanced evolutionary computation for finding superior routes
- **Multi-Objective Optimization** — Balance between travel time, fuel costs, and safety
- **Real-time Processing** — Instant route generation with configurable parameters

### ⚠️ Risk Analysis
- **Weather Risk Assessment** — Real-time weather pattern analysis along routes
- **Piracy Hotspot Detection** — Identification of high-risk maritime zones
- **Traffic Analysis** — Maritime traffic density monitoring
- **Combined Risk Scoring** — Weighted risk calculations for comprehensive hazard assessment

### 📊 Analytics & Visualization
- **Interactive Maps** — Leaflet-based map visualization with route overlays
- **Risk Dashboards** — Comprehensive risk metrics by waypoint
- **Optimization Progress** — Genetic algorithm convergence visualization
- **Alternative Routes** — Comparison of multiple optimization scenarios
- **Simulation Engine** — Test routes under different weather/cost scenarios

### 🎨 User Experience
- **Day/Night Mode** — Full theme support with system preference detection
- **Professional UI** — Modern design with maritime aesthetic
- **Responsive Design** — Mobile-friendly interface
- **Data Export** — JSON export of route summaries

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **Maps** | Leaflet 1.9.4 |
| **Components** | Shadcn/UI + Radix UI |
| **Icons** | Lucide React |
| **Theme** | next-themes |
| **Backend** | FastAPI (Python) |
| **Algorithm** | Custom Genetic Algorithm |
| **Compute** | NumPy |

---

## 📁 Project Structure

```
NavAIgator/
├── frontend/                     # Next.js application
│   ├── app/
│   │   ├── page.tsx              # Landing page with hero section
│   │   ├── about/               # About page
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   └── globals.css          # Global styles and design tokens
│   ├── components/
│   │   ├── header.tsx           # Header with theme toggle
│   │   ├── footer.tsx           # Footer component
│   │   ├── route-optimizer.tsx  # Main optimization interface
│   │   ├── route-config.tsx     # Configuration panel
│   │   ├── map-visualization.tsx
│   │   ├── leaflet-map.tsx      # Leaflet map implementation
│   │   ├── risk-analysis-dashboard.tsx
│   │   ├── simulation-comparison.tsx
│   │   ├── route-summary.tsx
│   │   └── ui/                  # Shadcn UI components
│   ├── public/images/           # Maritime imagery & assets
│   └── package.json
├── backend/
│   ├── main.py                  # FastAPI app & genetic algorithm engine
│   └── requirements.txt
├── assets/                      # README banner SVGs
├── FEATURES.md
├── CONFIG.md
├── DEPLOYMENT.md
├── QUICK_START.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **Python** 3.10+
- **npm** or **yarn**

### Quick Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd NavAIgator

# 2. Start the Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3. Start the Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
cd frontend
npm run build
npm start
```

---

## 🗺️ Usage

### 1. Landing Page
- View platform features and benefits
- Access navigation to optimization tool
- Toggle between day and night mode

### 2. Route Optimization
- Select start and end ports from 10+ supported locations
- Choose ship type (Cargo, Container, Tanker, Passenger)
- Set optimization priorities (time, cost, safety)
- Configure algorithm parameters (population size, generations)

### 3. View Results

| Tab | Description |
|-----|-------------|
| **Route Map** | Interactive map with route visualization, risk zones, and weather patterns |
| **Risk Analysis** | Detailed risk breakdown by waypoint, optimization progress, fitness metrics |
| **Comparison** | Alternative routes and scenario simulations |
| **Summary** | Complete route details, waypoint info, and export options |

### 4. Simulation
- Test routes under different conditions
- Adjust weather impact and fuel cost factors
- Compare original vs. simulated performance
- Analyze percentage changes in key metrics

---

## 🌐 API Reference

**Base URL:** `https://navaigator.onrender.com`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ports` | List available ports |
| `GET` | `/ship-types` | Available ship types with specs |
| `POST` | `/optimize` | Route optimization request |
| `POST` | `/simulate` | Scenario simulation |
| `POST` | `/risk-analysis` | Risk assessment |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| **Primary** | Deep maritime blue `#3b82f6` |
| **Accent** | Ocean gold `#fbbf24` |
| **Background (Dark)** | Dark navy |
| **Font** | Geist / Geist Mono |
| **Breakpoints** | md 768px · lg 1024px |

---

## 🔮 Future Enhancements

- [ ] Real-time weather API integration
- [ ] Piracy database integration
- [ ] Marine traffic data feeds
- [ ] Historical route data analysis
- [ ] Team collaboration features
- [ ] Advanced scheduling
- [ ] Mobile native apps

---

## 🛟 Troubleshooting

| Issue | Fix |
|-------|-----|
| Map not loading | Ensure JavaScript is enabled; check Leaflet CDN in network tab |
| Backend connection error | Confirm API is running; check CORS settings and endpoint URL |
| Theme not persisting | Clear browser localStorage; verify next-themes initialization |

---

## 📄 License

This project is **proprietary and confidential.**

---

<p align="center">
  <img src="./assets/tagline_banner.svg" width="900" alt="Intelligence That Knows the Way"/>
</p>
