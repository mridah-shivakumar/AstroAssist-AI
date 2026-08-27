# AstroAssist AI

A dark, professional, space-inspired AI Mission Intelligence dashboard built with React, TypeScript, and NASA's public APIs.

---

## Features

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/` | Mission overview with navigation to all modules |
| **Asteroid Monitor** | `/asteroids` | Live near-Earth object tracking via NASA NeoWs API |
| **Mars Explorer** | `/mars` | Perseverance rover telemetry and NASA image library browser |
| **Mission Control** | `/missions` | 8 curated NASA missions with live thumbnails from NASA Image Library |
| **Mission Insights** | `/insights` | AI-generated asteroid risk briefing powered by Llama 3.1 8B |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| NASA data | NeoWs API, NASA Image and Video Library API |
| AI model | Llama 3.1 8B Instruct (via Hugging Face Inference Router) |
| AI proxy | Express (Node.js) — `server/proxy.cjs` |

---

## Architecture

```
Browser (React + Vite)
    │
    ├─ NASA NeoWs / Image Library  ← direct fetch (no API key needed for images)
    │
    └─ POST /api/insight  ──→  Vite dev proxy  ──→  server/proxy.cjs (port 3001)
                                                          │
                                                    HF_TOKEN (server-side only)
                                                          │
                                              Hugging Face Inference Router
                                                          │
                                                  Llama 3.1 8B Instruct
```

**Security**: `HF_TOKEN` is read exclusively by `server/proxy.cjs` from `process.env`.  
It is **never** sent to the browser, **never** bundled into the Vite output, and **never** exposed via a `VITE_` variable.

---

## Running Locally

### Prerequisites

- Node.js 18+
- A NASA API key (free at [api.nasa.gov](https://api.nasa.gov/))
- A Hugging Face account and API token (free at [huggingface.co](https://huggingface.co/))

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Create a `.env` file in the project root (**never commit this file**):

```
VITE_NASA_API_KEY=your_nasa_api_key_here
HF_TOKEN=your_huggingface_token_here
```

> `.env` is listed in `.gitignore` and will **never** be committed.  
> `HF_TOKEN` must **not** be prefixed with `VITE_` — it is for the server proxy only.

### 3. Start both servers (two terminals)

**Terminal 1 — AI proxy:**
```bash
npm run proxy
```

**Terminal 2 — Vite dev server:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Windows note:** `npm run dev:full` opens the proxy in a separate cmd window then starts Vite.  
> The two-terminal workflow above is more reliable across environments.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run proxy` | Start the AI insight proxy on port 3001 |
| `npm run dev:full` | Start proxy + Vite together (Windows: opens proxy in a new window) |
| `npm run build` | TypeScript check + production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Data Sources

### Live API data
- **NASA NeoWs** (`api.nasa.gov/neo/rest/v1/feed`) — near-Earth asteroid close-approach data
- **NASA Image and Video Library** (`images-api.nasa.gov`) — Mars/rover images and mission thumbnails

### Curated data
- **Mission Control** — mission name, status, launch date, target, and description are curated from [NASA.gov mission pages](https://www.nasa.gov/missions/) because no single NASA public endpoint exposes this information in machine-readable structured form. Thumbnail images for each mission are fetched live.

---

## AI Integration

The **Mission Insights** page generates a factual asteroid risk briefing using:

- **Data source:** live NASA NeoWs 7-day asteroid window
- **Model:** `meta-llama/Llama-3.1-8B-Instruct`
- **Provider:** Hugging Face Inference Router
- **Proxy:** `server/proxy.cjs` (Express)

The model is instructed to:
- Use only the supplied NASA data
- Not fabricate asteroid names, distances, velocities, or orbital details
- Distinguish the "Potentially Hazardous Asteroid" (PHA) orbit classification from actual impact probability
- Produce a concise, proportionate operational briefing

The briefing is generated manually on demand — it does not auto-generate on page load.

---

## Security Notes

- `.env` is `.gitignore`d — **never commit it**
- `HF_TOKEN` lives in `server/proxy.cjs` environment only — **never** in frontend code
- The Vite build does **not** embed `HF_TOKEN` — verified by bundle inspection
- NASA API key is only used for NeoWs requests — images API requires no key

---

## Project Structure

```
AstroAssist-AI/
├── index.html
├── package.json
├── vite.config.ts          # Proxies /api/* → localhost:3001
├── tailwind.config.js
├── tsconfig.json
├── server/
│   └── proxy.cjs           # Express AI proxy (holds HF_TOKEN)
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    │   ├── Card.tsx
    │   ├── Header.tsx
    │   ├── LoadingSpinner.tsx
    │   └── Sidebar.tsx
    ├── hooks/
    │   ├── useInsight.ts   # AI briefing state management
    │   └── useSpaceData.ts # Shared NASA data hook
    ├── pages/
    │   ├── Dashboard.tsx
    │   ├── AsteroidMonitor.tsx
    │   ├── MarsExplorer.tsx
    │   ├── MissionControl.tsx
    │   └── MissionInsights.tsx
    ├── services/
    │   └── nasaApi.ts      # All NASA API calls + AI prompt builder
    └── types/
        └── index.ts
```
