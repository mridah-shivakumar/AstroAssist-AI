# AstroAssist AI — Frontend Foundation Plan

## Top-Level Overview

Bootstrap a React + TypeScript + Vite + Tailwind CSS single-page application inside the `AstroAssist-AI/` folder.
The app is a dark, space-inspired AI Mission Intelligence platform with four pages and four reusable UI components wired together with React Router.
No Navbar — navigation is handled entirely by a professional collapsible left Sidebar. Each page includes its own inline Header component.
No backend logic, NASA APIs, or AI features are included in this initial version — only a clean, scalable frontend foundation.

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding & Configuration

**Intent**
Set up the Vite + React + TypeScript project, install all dependencies, and configure Tailwind CSS so the app compiles and renders a root element.

**Expected Outcomes**
- `AstroAssist-AI/package.json` declares all required dependencies
- `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json` are present and valid
- `tailwind.config.js` and `postcss.config.js` are configured
- `index.html` and `src/main.tsx` exist and the dev server starts without errors

**Todo List**
1. Create `AstroAssist-AI/package.json` with scripts (`dev`, `build`, `preview`) and all dependencies:
   - `react`, `react-dom`, `react-router-dom`
   - `typescript`, `vite`, `@vitejs/plugin-react`
   - `tailwindcss`, `postcss`, `autoprefixer`
   - `@types/react`, `@types/react-dom`
2. Create `vite.config.ts` referencing the React plugin
3. Create `tsconfig.json` and `tsconfig.node.json` with strict TS settings
4. Create `tailwind.config.js` with `content` glob covering `src/**/*.{ts,tsx}` and a custom theme extending colors for space blues and purples
5. Create `postcss.config.js` referencing tailwind and autoprefixer
6. Create `index.html` with a `<div id="root">` mount point
7. Create `src/main.tsx` mounting `<App />` inside a `BrowserRouter`
8. Create `src/index.css` importing Tailwind directives (`@tailwind base/components/utilities`) plus base dark-background body styles
9. Create `src/App.tsx` as a minimal router shell (routes to be filled in Sub-Task 3)

**Relevant Context**
- Target folder: `AstroAssist-AI/`
- Tailwind custom colors: space-dark (`#0a0e1a`), space-blue (`#1e3a8a` range), space-purple (`#7c3aed` range), accent-cyan (`#06b6d4`)

**Status** — `[ ] pending`

---

### Sub-Task 2 — Reusable UI Components

**Intent**
Build the five reusable components that every page will use, establishing the design system for the whole app.

**Expected Outcomes**
- `src/components/Sidebar.tsx` — collapsible left sidebar with logo, icon + label nav items, and a toggle button
- `src/components/Header.tsx` — page-level header accepting `title` and `subtitle` props
- `src/components/Card.tsx` — generic content card accepting `title`, `children`, and optional `icon` / `className` props
- `src/components/LoadingSpinner.tsx` — animated spinner with optional `size` prop
- All components use Tailwind classes consistent with the dark space theme
- No `Navbar.tsx` — removed entirely

**Todo List**
1. Create `src/components/Sidebar.tsx` — full-height left panel with AstroAssist AI wordmark/logo at the top, vertical nav items (Dashboard, Asteroid Monitor, Mars Explorer, Mission Insights) with inline SVG icons, active state highlight, and a collapse/expand toggle button
2. Create `src/components/Header.tsx` — accepts `title: string` and `subtitle?: string`, renders a styled section header with a subtle gradient underline
3. Create `src/components/Card.tsx` — dark-glass card (dark bg, subtle border, rounded corners), accepts `title`, optional `icon`, `children`, optional `className`
4. Create `src/components/LoadingSpinner.tsx` — CSS-animated spinning ring, accepts optional `size?: 'sm' | 'md' | 'lg'`

**Relevant Context**
- All components live in `src/components/`
- No external icon library — use inline SVG paths or emoji/Unicode to keep zero extra deps
- Tailwind classes only; no inline style blocks except for dynamic values

**Status** — `[ ] pending`

---

### Sub-Task 3 — Pages

**Intent**
Create the four application pages, each using the shared layout components and conveying meaningful, domain-specific content without placeholder text.

**Expected Outcomes**
- `src/pages/Dashboard.tsx` — mission overview with summary stat cards
- `src/pages/AsteroidMonitor.tsx` — near-Earth object tracking overview
- `src/pages/MarsExplorer.tsx` — Mars surface and mission status overview
- `src/pages/MissionInsights.tsx` — AI-generated summaries and explanations placeholder layout

**Todo List**
1. Create `src/pages/Dashboard.tsx`:
   - Use `Header` with title "Mission Control Dashboard" and subtitle "Real-time space mission intelligence at a glance"
   - Render four stat `Card`s: Active Missions, Near-Earth Objects Today, Mars Rover Status, AI Queries Processed
   - Each card shows a meaningful static figure and a short descriptor
2. Create `src/pages/AsteroidMonitor.tsx`:
   - Use `Header` with title "Asteroid Monitor" and subtitle "Tracking near-Earth objects and potential impact risk"
   - Render a grid of `Card`s describing monitoring categories: Close Approach Events, Hazardous Asteroids, Velocity Tracking, Orbital Analysis
3. Create `src/pages/MarsExplorer.tsx`:
   - Use `Header` with title "Mars Explorer" and subtitle "Surface data, rover telemetry, and atmospheric conditions"
   - Render `Card`s for: Rover Status, Atmospheric Data, Surface Temperature, Sol Counter
4. Create `src/pages/MissionInsights.tsx`:
   - Use `Header` with title "Mission Insights" and subtitle "AI-generated explanations and summaries of space mission data"
   - Render a content-style layout with placeholder `Card`s for: Latest Mission Summary, Asteroid Risk Briefing, Mars Conditions Report, Upcoming Events — each with a short, meaningful descriptor and a "Coming Soon" badge
5. Each page imports `Header` and `Card` from `src/components/`

**Relevant Context**
- Pages live in `src/pages/`
- No real data — use static, domain-appropriate values
- No lorem ipsum

**Status** — `[ ] pending`

---

### Sub-Task 4 — Routing & App Shell Layout

**Intent**
Wire the router, integrate the collapsible Sidebar into a persistent shell layout, and connect all four pages to their routes. No Navbar is used.

**Expected Outcomes**
- Navigating to `/` renders Dashboard
- Navigating to `/asteroids` renders AsteroidMonitor
- Navigating to `/mars` renders MarsExplorer
- Navigating to `/insights` renders MissionInsights
- `Sidebar` is always visible on the left; only the main content area changes per route
- Active route is visually highlighted in the Sidebar

**Todo List**
1. Update `src/App.tsx` to define a persistent shell layout: `Sidebar` on the left, `<Outlet />` filling the remaining main content area — no Navbar
2. Define routes using `createBrowserRouter` or `<Routes>`:
   - `/` → `Dashboard`
   - `/asteroids` → `AsteroidMonitor`
   - `/mars` → `MarsExplorer`
   - `/insights` → `MissionInsights`
3. Use `NavLink` (from React Router) inside `Sidebar` so the active class is applied automatically
4. Ensure the layout is responsive: sidebar collapses to icon-only mode on small screens

**Relevant Context**
- `src/App.tsx`, `src/main.tsx`
- `src/components/Sidebar.tsx`
- All pages in `src/pages/`

**Status** — `[ ] pending`

---

### Sub-Task 5 — Type Definitions & Folder Completion

**Intent**
Add shared TypeScript type definitions and ensure all required folder scaffolding (`hooks/`, `services/`, `types/`, `assets/`) is present so the project structure is complete and ready for future feature additions.

**Expected Outcomes**
- `src/types/index.ts` exports core domain types (Mission, AsteroidObject, RoverStatus, InsightSummary)
- `src/hooks/` contains a placeholder `useSpaceData.ts` stub hook
- `src/services/` contains a placeholder `nasaApi.ts` stub service
- `src/assets/` contains a simple SVG logo used in the Sidebar
- The project compiles with `tsc --noEmit` without errors

**Todo List**
1. Create `src/types/index.ts` with TypeScript interfaces: `Mission`, `AsteroidObject`, `RoverStatus`, `InsightSummary`
2. Create `src/hooks/useSpaceData.ts` — exports a stub hook `useSpaceData` that returns empty arrays/null with a TODO comment for future NASA API integration
3. Create `src/services/nasaApi.ts` — exports stub async functions (`fetchAsteroids`, `fetchMarsPhotos`, `fetchMissions`) with TODO comments
4. Create `src/assets/logo.svg` — a simple rocket or planet SVG icon used in the Sidebar
5. Verify no TypeScript errors exist across all files

**Relevant Context**
- These files establish contracts and extension points for future Sub-Tasks without implementing any logic
- `src/types/index.ts` types should align with what the pages statically display

**Status** — `[ ] pending`

---

## Folder Structure (Target)

```
AstroAssist-AI/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── assets/
    │   └── logo.svg
    ├── components/
    │   ├── Sidebar.tsx
    │   ├── Header.tsx
    │   ├── Card.tsx
    │   └── LoadingSpinner.tsx
    ├── hooks/
    │   └── useSpaceData.ts
    ├── pages/
    │   ├── Dashboard.tsx
    │   ├── AsteroidMonitor.tsx
    │   ├── MarsExplorer.tsx
    │   └── MissionInsights.tsx
    ├── services/
    │   └── nasaApi.ts
    └── types/
        └── index.ts
```
