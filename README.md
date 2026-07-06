<div align="center">

<!--  ANIMATED OCEAN WAVES + SHIP  -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 160" width="900" height="160">
  <defs>
    <linearGradient id="ocean" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a1628;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#001f3f;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="wave1grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#0d2b4a;stop-opacity:0.5" />
    </linearGradient>
    <linearGradient id="wave2grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.3" />
    </linearGradient>
    <linearGradient id="shipbody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#94a3b8" />
      <stop offset="100%" style="stop-color:#475569" />
    </linearGradient>
    <linearGradient id="shipdeck" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#cbd5e1" />
      <stop offset="100%" style="stop-color:#94a3b8" />
    </linearGradient>
    <!-- Glow filter for stars -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Ocean background -->
  <rect width="900" height="160" fill="url(#ocean)" rx="12"/>

  <!-- Stars -->
  <g filter="url(#glow)">
    <circle cx="50" cy="18" r="1.2" fill="white" opacity="0.8"/>
    <circle cx="130" cy="10" r="0.9" fill="white" opacity="0.6"/>
    <circle cx="220" cy="22" r="1.1" fill="white" opacity="0.7"/>
    <circle cx="350" cy="8" r="1.0" fill="white" opacity="0.5"/>
    <circle cx="480" cy="15" r="1.3" fill="white" opacity="0.8"/>
    <circle cx="600" cy="7" r="0.8" fill="white" opacity="0.6"/>
    <circle cx="720" cy="20" r="1.1" fill="white" opacity="0.7"/>
    <circle cx="830" cy="12" r="1.0" fill="white" opacity="0.5"/>
    <circle cx="870" cy="25" r="0.9" fill="white" opacity="0.6"/>
  </g>

  <!-- Moon -->
  <circle cx="820" cy="22" r="12" fill="#fbbf24" opacity="0.9"/>
  <circle cx="826" cy="18" r="10" fill="#0a1628" opacity="1"/>

  <!-- Wave 1 (back) -->
  <path d="M0,95 C60,82 120,108 180,95 C240,82 300,108 360,95 C420,82 480,108 540,95 C600,82 660,108 720,95 C780,82 840,108 900,95 L900,160 L0,160 Z" fill="url(#wave1grad)" opacity="0.7">
    <animateTransform attributeName="transform" type="translate" from="0,0" to="-180,0" dur="6s" repeatCount="indefinite"/>
  </path>
  <path d="M900,95 C960,82 1020,108 1080,95 C1140,82 1200,108 1260,95 L1260,160 L900,160 Z" fill="url(#wave1grad)" opacity="0.7">
    <animateTransform attributeName="transform" type="translate" from="0,0" to="-180,0" dur="6s" repeatCount="indefinite"/>
  </path>

  <!-- Wave 2 (front) -->
  <path d="M0,108 C50,98 100,118 150,108 C200,98 250,118 300,108 C350,98 400,118 450,108 C500,98 550,118 600,108 C650,98 700,118 750,108 C800,98 850,118 900,108 L900,160 L0,160 Z" fill="url(#wave2grad)" opacity="0.8">
    <animateTransform attributeName="transform" type="translate" from="0,0" to="150,0" dur="4s" repeatCount="indefinite"/>
  </path>
  <path d="M-900,108 C-850,98 -800,118 -750,108 C-700,98 -650,118 -600,108 C-550,98 -500,118 -450,108 C-400,98 -350,118 -300,108 C-250,98 -200,118 -150,108 C-100,98 -50,118 0,108 L0,160 L-900,160 Z" fill="url(#wave2grad)" opacity="0.8">
    <animateTransform attributeName="transform" type="translate" from="0,0" to="150,0" dur="4s" repeatCount="indefinite"/>
  </path>

  <!-- SHIP GROUP - moves left to right -->
  <g>
    <animateTransform attributeName="transform" type="translate" from="-160,0" to="1060,0" dur="14s" repeatCount="indefinite"/>
    <!-- Ship bobbing -->
    <g>
      <animateTransform attributeName="transform" type="translate" from="0,0" to="0,-4" dur="2s" repeatCount="indefinite" additive="sum" calcMode="spline" keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95" values="0,0;0,-4;0,0"/>
      <!-- Hull -->
      <polygon points="0,88 140,88 130,100 10,100" fill="url(#shipbody)"/>
      <!-- Deck -->
      <rect x="10" y="70" width="120" height="18" fill="url(#shipdeck)" rx="2"/>
      <!-- Bridge/cabin -->
      <rect x="70" y="50" width="45" height="20" fill="#e2e8f0" rx="3"/>
      <!-- Bridge windows -->
      <rect x="75" y="54" width="8" height="6" fill="#60a5fa" rx="1" opacity="0.9"/>
      <rect x="88" y="54" width="8" height="6" fill="#60a5fa" rx="1" opacity="0.9"/>
      <rect x="101" y="54" width="8" height="6" fill="#60a5fa" rx="1" opacity="0.9"/>
      <!-- Funnel/chimney -->
      <rect x="88" y="38" width="12" height="14" fill="#dc2626" rx="2"/>
      <rect x="86" y="36" width="16" height="5" fill="#b91c1c" rx="1"/>
      <!-- Smoke from funnel -->
      <circle cx="94" cy="30" r="4" fill="#94a3b8" opacity="0.5">
        <animate attributeName="cy" values="30;20;10" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0.3;0" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="4;6;8" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="96" cy="26" r="3" fill="#94a3b8" opacity="0.4">
        <animate attributeName="cy" values="26;16;6" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.2;0" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="3;5;7" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <!-- Mast -->
      <line x1="30" y1="70" x2="30" y2="42" stroke="#64748b" stroke-width="2"/>
      <!-- Flag on mast -->
      <polygon points="30,42 46,48 30,54" fill="#2563eb" opacity="0.9"/>
      <!-- Cargo containers on deck -->
      <rect x="15" y="62" width="22" height="10" fill="#16a34a" rx="1"/>
      <rect x="40" y="62" width="22" height="10" fill="#dc2626" rx="1"/>
      <!-- Wake/foam trail behind ship -->
      <ellipse cx="-10" cy="97" rx="18" ry="4" fill="white" opacity="0.35"/>
      <ellipse cx="-35" cy="97" rx="12" ry="3" fill="white" opacity="0.2"/>
      <ellipse cx="-55" cy="97" rx="8" ry="2" fill="white" opacity="0.1"/>
    </g>
  </g>
</svg>

<!-- ANIMATED TITLE -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 100" width="900" height="100">
  <defs>
    <linearGradient id="titlegrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#38bdf8"/>
      <stop offset="40%" style="stop-color:#2563eb"/>
      <stop offset="70%" style="stop-color:#fbbf24"/>
      <stop offset="100%" style="stop-color:#38bdf8"/>
      <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="3s" repeatCount="indefinite"/>
    </linearGradient>
    <filter id="titleglow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="900" height="100" fill="#0a1628" rx="0"/>
  <text x="450" y="60" font-family="'Segoe UI', Arial, sans-serif" font-size="54" font-weight="900" text-anchor="middle" fill="url(#titlegrad)" filter="url(#titleglow)" letter-spacing="4">
    NavAIgator
    <animate attributeName="opacity" values="0;1" dur="1.2s" fill="freeze"/>
  </text>
  <text x="450" y="85" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="400" text-anchor="middle" fill="#94a3b8" letter-spacing="6">
    AI · POWERED · MARITIME · ROUTE · OPTIMIZATION
    <animate attributeName="opacity" values="0;1" dur="1.8s" fill="freeze"/>
  </text>
</svg>

<!-- BADGES -->

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)

</div>

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
| Map not loading | Ensure JavaScript is enabled; check for Leaflet CDN resources in network tab |
| Backend connection error | Confirm API is running; check CORS settings and endpoint URL |
| Theme not persisting | Clear browser cache/localStorage; verify next-themes initialization |

---

## 📄 License

This project is **proprietary and confidential.**

---

<div align="center">

<!-- ANIMATED CLOSING TAGLINE -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 90" width="900" height="90">
  <defs>
    <linearGradient id="taggrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#fbbf24"/>
      <stop offset="50%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#38bdf8"/>
    </linearGradient>
    <filter id="tagglow">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Animated dash for the line -->
    <linearGradient id="linegrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:0"/>
      <stop offset="50%" style="stop-color:#2563eb;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="900" height="90" fill="#0a1628" rx="12"/>
  <!-- Decorative animated line top -->
  <rect x="0" y="0" width="900" height="2" fill="url(#linegrad)" rx="1">
    <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
  </rect>
  <!-- Anchor icon -->
  <text x="450" y="38" font-family="'Segoe UI', Arial, sans-serif" font-size="22" text-anchor="middle" fill="#2563eb" filter="url(#tagglow)">
    ⚓
    <animateTransform attributeName="transform" type="rotate" from="0 450 38" to="360 450 38" dur="8s" repeatCount="indefinite"/>
  </text>
  <!-- Tagline -->
  <text x="450" y="62" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="url(#taggrad)" filter="url(#tagglow)" letter-spacing="3">
    Intelligence That Knows the Way
    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
  </text>
  <!-- Sub-tagline -->
  <text x="450" y="80" font-family="'Segoe UI', Arial, sans-serif" font-size="10" text-anchor="middle" fill="#475569" letter-spacing="2">
    NavAIgator · AI-Powered Maritime Route Optimization
  </text>
  <!-- Decorative animated line bottom -->
  <rect x="0" y="88" width="900" height="2" fill="url(#linegrad)" rx="1">
    <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite"/>
  </rect>
</svg>

</div>
