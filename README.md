# 🚀 AstroAssist AI

### AI-Powered Mission Intelligence for Smarter Space Exploration

<p align="center">
  <strong>Transforming space exploration from data-heavy to insight-driven systems.</strong>
</p>

<p align="center">
  Built for the <strong>IBM AI Builders Challenge — August 2026</strong><br>
  <strong>Challenge Theme: Advance Space Exploration with AI</strong>
</p>

---

## 📌 Project Overview

Space exploration generates enormous amounts of data from satellites, spacecraft, missions, near-Earth objects, planetary exploration and scientific observations.

The challenge is not simply collecting this data — it is **understanding it quickly enough to support better decisions**.

**AstroAssist AI** is an AI-powered space mission intelligence platform that brings NASA data together into a single interface and transforms raw space information into concise, understandable insights.

Instead of forcing users to manually interpret different NASA datasets, AstroAssist provides dedicated modules for:

* 🌍 Mission intelligence
* ☄️ Near-Earth asteroid monitoring
* 🔴 Mars exploration
* 🤖 AI-generated mission insights
* 🚀 Upcoming space-event analysis

The platform combines **live NASA data, curated mission intelligence, and a server-side AI inference layer** to demonstrate how AI can make space exploration data more accessible and actionable.

---

# 🎯 IBM AI Builders Challenge

## Selected Challenge

**Advance Space Exploration with AI**

### Challenge Theme

> Advance Space Exploration with AI

The challenge asks participants to build AI-powered solutions that help:

* Improve mission success
* Enable smarter decisions
* Make space data more usable and accessible
* Support scientists, engineers and mission operators
* Transform space exploration from **data-heavy to insight-driven systems**

AstroAssist AI directly addresses this goal by combining NASA space data with AI-generated analysis.

---

# 💡 Problem Statement

Modern space exploration produces massive quantities of data, but raw data alone does not automatically translate into useful intelligence.

Mission teams and space-data users may need to work with:

* Near-Earth object observations
* Close-approach information
* Mission metadata
* Planetary imagery
* Space-event data
* Scientific observations

These datasets are often distributed across different sources and can be difficult to interpret quickly.

A user should not have to manually inspect multiple APIs, datasets and technical fields just to understand:

> **What is happening, what matters, and what should I pay attention to?**

AstroAssist AI addresses this gap by creating an **AI-assisted mission intelligence layer** over NASA data.

---

# 💭 Solution Description

AstroAssist AI provides a unified space intelligence dashboard where users can:

### 1. Monitor Near-Earth Objects

Retrieve live NASA NeoWs data and inspect asteroid close approaches, velocity, size and hazardous-object classifications.

### 2. Explore Mars

Browse NASA Mars and Perseverance imagery and access contextual information about Mars exploration.

### 3. Understand Missions

Explore a curated catalogue of real NASA missions enriched with live NASA Image Library thumbnails.

### 4. Generate AI Insights

Send structured NASA data to an AI model and receive concise, data-grounded briefings.

### 5. Analyse Upcoming Space Events

Use the live NeoWs dataset to identify and summarise upcoming close-approach events.

The goal is simple:

**NASA data → structured information → AI reasoning → human-readable mission intelligence**

---

# 🧠 Key Features

| Module                           | Description                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------- |
| 🏠 **Mission Control Dashboard** | Central overview of the AstroAssist ecosystem                                 |
| ☄️ **Asteroid Monitor**          | Live near-Earth object tracking using NASA NeoWs                              |
| 🔴 **Mars Explorer**             | NASA Mars imagery and exploration information                                 |
| 🚀 **Mission Control**           | Curated NASA mission catalogue with live thumbnails                           |
| 🤖 **Mission Insights**          | Four AI-powered intelligence modules                                          |
| 🔐 **Secure AI Proxy**           | Keeps the Hugging Face token server-side                                      |
| 📊 **Live + Curated Data**       | Clearly distinguishes live API information from curated reference information |

---

# 🖥️ Application Modules

## 🏠 1. Mission Control Dashboard

The Dashboard acts as the central command interface for AstroAssist AI.

It provides:

* Project overview
* Tracked mission information
* AI module availability
* Mission timeline
* Data-source status
* Navigation to all major modules

The dashboard intentionally avoids fabricated operational statistics.

Where data is curated rather than live, the interface clearly communicates that distinction.

### 📸 Screenshot




![AstroAssist AI Dashboard](D:\Astroassist_AI\AstroAssist-AI\screenshots\01-dashboard.png)


---

# ☄️ 2. Asteroid Monitor

The Asteroid Monitor uses NASA's **Near Earth Object Web Service (NeoWs)** to retrieve live asteroid data.

The application analyses the available seven-day NeoWs window and presents information such as:

* Asteroid name
* Close-approach date
* Miss distance
* Relative velocity
* Estimated diameter
* Potentially Hazardous Asteroid classification

The module is designed to make technically dense asteroid observations easier to understand.

### Data Flow

```text
NASA NeoWs
    ↓
Asteroid API Response
    ↓
AstroAssist Data Layer
    ↓
Asteroid Monitor
    ↓
Mission Insights AI
```

### 📸 Screenshot


![Asteroid Monitor](D:\Astroassist_AI\AstroAssist-AI\screenshots\02-asteroid-monitor.png)




# 🔴 3. Mars Explorer

Mars Explorer provides an interface for exploring NASA Mars imagery and Perseverance-related information.

The module uses the **NASA Image and Video Library API** to retrieve relevant imagery.

Users can:

* Search NASA Mars imagery
* Browse returned images
* Navigate through results
* Explore Perseverance-related content
* View contextual Mars information

### Important Data Limitation

The old NASA Mars Rover Photos Manifest endpoint used by many older applications is no longer available.

Because of this, AstroAssist does **not fabricate live rover telemetry**.

Values that cannot currently be sourced from a functioning NASA endpoint are explicitly labelled as static/reference information.

This is an intentional design decision to maintain data integrity.

### 📸 Screenshot

![Mars Explorer](D:\Astroassist_AI\AstroAssist-AI\screenshots\03-mars-explorer.png)

# 🚀 4. Mission Control

Mission Control provides a curated catalogue of **8 real NASA missions**.

Each mission contains information such as:

* Mission name
* Mission status
* Launch date
* Target
* Mission description
* NASA Image Library thumbnail

The structured mission information is curated because there is no single NASA public API endpoint providing all required mission fields in a consistent machine-readable format.

However, mission thumbnails are retrieved live from NASA's Image and Video Library.

### Data Classification

| Information  | Source                           |
| ------------ | -------------------------------- |
| Mission name | Curated NASA mission information |
| Status       | Curated NASA mission information |
| Launch date  | Curated NASA mission information |
| Target       | Curated NASA mission information |
| Description  | Curated NASA mission information |
| Thumbnail    | Live NASA Image Library          |

The interface explicitly communicates this distinction rather than presenting curated information as live telemetry.

### 📸 Screenshot


![Mission Control](D:\Astroassist_AI\AstroAssist-AI\screenshots\04-mission-control.png)


# 🤖 5. Mission Insights

Mission Insights is the **core AI component** of AstroAssist AI.

Instead of displaying generic AI-generated text, the system builds prompts directly from the available NASA data.

The four modules are:

### ☄️ Asteroid Risk Briefing

Uses live NASA NeoWs asteroid data to generate a concise operational briefing.

The AI receives information such as:

* Number of objects
* Close-approach dates
* Miss distances
* Estimated sizes
* Relative velocities
* PHA classifications

The model is explicitly instructed to use only the supplied data.

---

### 🚀 Mission Intelligence Summary

Uses the curated NASA mission catalogue together with live NASA Image Library information.

The AI produces a concise summary explaining the supplied mission information.

The model is instructed not to invent:

* Mission dates
* Mission objectives
* Mission status
* Targets
* Scientific results

---

### 🔴 Mars Conditions Report

Uses live NASA Image Library search results relating to Mars and Perseverance.

The AI converts the supplied image-library metadata into a concise Mars exploration briefing.

Because current live rover telemetry is not available through the integrated endpoint, the system does not pretend to provide real-time MEDA or rover telemetry.

---

### 🌌 Upcoming Space Events

Uses the live NeoWs seven-day dataset and identifies upcoming close-approach events.

The application first displays the relevant events and then allows the AI to summarise them.

This module currently focuses on asteroid close approaches rather than claiming to provide a complete launch/eclipses/orbital-events calendar.


### 📸 Screenshot


![Mission Insights](D:\Astroassist_AI\AstroAssist-AI\screenshots\05-mission-insights.png)



# 🧠 AI Architecture

The AI system follows a **data-grounded generation** approach.

```text
                    ┌─────────────────────┐
                    │      NASA APIs      │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          NASA NeoWs                NASA Image Library
                 │                           │
                 └─────────────┬─────────────┘
                               │
                         React Data Layer
                               │
                       Structured Prompt
                               │
                               ▼
                     POST /api/insight
                               │
                         Vite Proxy
                               │
                               ▼
                    Express AI Proxy
                      server/proxy.cjs
                               │
                        HF_TOKEN
                   (server-side only)
                               │
                               ▼
                  Hugging Face Router
                               │
                               ▼
               Llama 3.1 8B Instruct
                               │
                               ▼
                     Generated Briefing
                               │
                               ▼
                       Mission Insights
```

---

# 🤖 AI Model

### Model

`meta-llama/Llama-3.1-8B-Instruct`

### Provider

Hugging Face Inference Router

### AI Endpoint

```text
POST /api/insight
```

The browser never communicates directly with the Hugging Face API.

Instead:

```text
Browser
   ↓
/api/insight
   ↓
Vite Proxy
   ↓
Express Server
   ↓
Hugging Face
```

---

# 🛡️ AI Grounding & Hallucination Control

A major design principle of AstroAssist AI is:

> **The AI should interpret the data, not invent the data.**

Each prompt contains explicit instructions such as:

```text
Use ONLY the supplied data.

Do not fabricate asteroid names,
distances, velocities, mission information,
dates or scientific observations.

If the supplied data is insufficient,
state that clearly.
```

For asteroid analysis, the model is also instructed to distinguish:

```text
Potentially Hazardous Asteroid classification
        ≠
Actual impact probability
```

This prevents the AI from turning a classification into an unsupported claim of collision risk.

---

# 🔄 AI Generation Flow

Each AI module follows the same general architecture:

```text
User clicks "Generate Briefing"
             ↓
Relevant NASA data is collected
             ↓
Prompt builder creates deterministic prompt
             ↓
POST /api/insight
             ↓
Express proxy receives request
             ↓
HF_TOKEN read from server environment
             ↓
Hugging Face Inference Router
             ↓
Llama 3.1 8B Instruct
             ↓
AI response returned
             ↓
React renders briefing
```

AI generation is **user-triggered**.

The application does not repeatedly call the AI model on page load.

---

# 🔐 Security Architecture

The Hugging Face API token is treated as a server-side secret.

### Environment variable

```env
HF_TOKEN=your_huggingface_token
```

The token is accessed only through:

```text
process.env.HF_TOKEN
```

inside:

```text
server/proxy.cjs
```

It is **not**:

* Stored in React code
* Stored in `import.meta.env`
* Prefixed with `VITE_`
* Sent to the browser
* Included in the Vite production bundle

### Security flow

```text
                    ❌ Browser
                       │
                       │ HF_TOKEN
                       │
                       X
                       │
              ┌────────▼────────┐
              │ Express Proxy   │
              │ server/proxy.cjs│
              └────────┬────────┘
                       │
                  HF_TOKEN
                       │
                       ▼
              Hugging Face Router
```

The production bundle was also inspected to verify that the Hugging Face token and router URL are not embedded in frontend JavaScript.

---

# 🧰 Technology Stack

| Category        | Technology                    |
| --------------- | ----------------------------- |
| Frontend        | React 18                      |
| Language        | TypeScript                    |
| Build Tool      | Vite                          |
| Styling         | Tailwind CSS                  |
| Routing         | React Router v6               |
| Backend Proxy   | Node.js + Express             |
| AI              | Llama 3.1 8B Instruct         |
| AI Provider     | Hugging Face Inference Router |
| Space Data      | NASA NeoWs                    |
| Images          | NASA Image and Video Library  |
| Development     | IBM Bob                       |
| Package Manager | npm                           |

---

# 🧩 How IBM Bob Was Used

IBM Bob was used as the **primary development tool** throughout the project, in accordance with the IBM AI Builders Challenge requirements.

IBM Bob assisted with:

* Project scaffolding
* React component development
* TypeScript implementation
* NASA API integration
* React Router implementation
* Tailwind UI development
* Data-flow implementation
* AI integration
* Server-side proxy implementation
* Prompt engineering
* Error handling
* Security checks
* Debugging
* TypeScript/build verification
* UI refinement
* Documentation

The development process followed an iterative workflow:

```text
Challenge Requirement
        ↓
Architecture Planning
        ↓
IBM Bob-assisted Implementation
        ↓
Run Application
        ↓
Test NASA APIs
        ↓
Debug
        ↓
Verify TypeScript
        ↓
Verify Production Build
        ↓
Refine UI / Security
        ↓
Final Prototype
```

IBM Bob was therefore not simply used to generate isolated snippets — it was used throughout the development lifecycle as the primary AI-assisted development environment.

---

# 🌐 NASA Data Sources

## NASA NeoWs

Near-Earth Object Web Service.

Used for:

* Near-Earth asteroid observations
* Close-approach information
* Miss distance
* Relative velocity
* Estimated diameter
* Hazard classification

Endpoint:

```text
https://api.nasa.gov/neo/rest/v1/feed
```

---

## NASA Image and Video Library

Used for:

* Mars imagery
* Perseverance-related images
* Mission thumbnails
* Image-library metadata

Endpoint:

```text
https://images-api.nasa.gov/
```

---

# 📊 Live vs Curated Data

AstroAssist deliberately distinguishes between live API information and curated reference information.

| Module                | Data                          | Classification |
| --------------------- | ----------------------------- | -------------- |
| Asteroid Monitor      | NeoWs asteroid feed           | 🟢 Live        |
| Asteroid AI Briefing  | NeoWs asteroid feed           | 🟢 Live        |
| Mars imagery          | NASA Image Library            | 🟢 Live        |
| Mars AI Report        | NASA Image Library metadata   | 🟢 Live        |
| Mission thumbnails    | NASA Image Library            | 🟢 Live        |
| Mission facts         | NASA mission information      | 🟡 Curated     |
| Mars reference values | Static contextual information | 🟡 Reference   |
| Upcoming Space Events | NeoWs close approaches        | 🟢 Live        |

This prevents the interface from presenting static information as real-time telemetry.

---

# 🏗️ Project Structure

```text
AstroAssist-AI/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
│
├── server/
│   └── proxy.cjs
│
├── src/
│   │
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── hooks/
│   │   ├── useInsight.ts
│   │   ├── useInsightModule.ts
│   │   └── useSpaceData.ts
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── AsteroidMonitor.tsx
│   │   ├── MarsExplorer.tsx
│   │   ├── MissionControl.tsx
│   │   └── MissionInsights.tsx
│   │
│   ├── services/
│   │   └── nasaApi.ts
│   │
│   └── types/
│       └── index.ts
│
└── README.md
```

---

# ⚙️ Local Setup

## Prerequisites

* Node.js 18+
* npm
* NASA API key
* Hugging Face account
* Hugging Face API token

---

## 1. Clone the Repository

```bash
git clone https://github.com/mridah-shivakumar/AstroAssist-AI.git
```

```bash
cd AstroAssist-AI
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create `.env`

Create a `.env` file in the project root:

```env
VITE_NASA_API_KEY=your_nasa_api_key
HF_TOKEN=your_huggingface_token
```

### ⚠️ Important

Never commit `.env`.

The repository already ignores `.env` through `.gitignore`.

Also:

```text
HF_TOKEN
```

must **never** be renamed to:

```text
VITE_HF_TOKEN
```

because variables beginning with `VITE_` are exposed to frontend code.

---

# ▶️ Running the Application

AstroAssist uses two processes during development.

## Terminal 1 — AI Proxy

```bash
npm run proxy
```

The proxy runs on:

```text
http://localhost:3001
```

---

## Terminal 2 — Vite Development Server

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open:

```text
http://localhost:5173
```

---

## Optional

On Windows:

```bash
npm run dev:full
```

starts the proxy in a separate console and starts the Vite development server.

The two-terminal method is recommended for development reliability.

---

# 📜 Available Scripts

| Command            | Purpose                             |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Start Vite development server       |
| `npm run proxy`    | Start Express AI proxy              |
| `npm run dev:full` | Start proxy + Vite                  |
| `npm run build`    | TypeScript check + production build |
| `npm run preview`  | Preview production build            |

---

# 🧪 Verification

The final implementation was verified using TypeScript and Vite production builds.

### TypeScript

```bash
npx tsc --noEmit
```

Expected result:

```text
No output
Zero TypeScript errors
```

### Production Build

```bash
npm run build
```

Expected result:

```text
✓ built successfully
```

The final implementation was also checked for:

* AI proxy functionality
* NASA API integration
* AI generation
* Route functionality
* Missing-image fallbacks
* Independent loading states
* Production build errors
* Client-side token exposure

---

# 🛠️ Error Handling

AstroAssist is designed so that one failing data source does not unnecessarily break unrelated modules.

Examples:

### NASA API failure

The relevant module displays an error state rather than fabricated data.

### NASA image failure

Broken images fall back to a placeholder instead of displaying broken image elements.

### AI proxy failure

Mission Insights displays an AI-generation error state and allows the user to retry.

### Missing rover telemetry

The application does not fabricate telemetry and instead labels unavailable information as static/reference data.

---

# ⚠️ Known Limitations

## 1. Mars Rover Telemetry

The older Mars Rover Photos manifest endpoint is no longer available.

Therefore AstroAssist currently does not claim to provide:

* Live rover telemetry
* Live MEDA readings
* Live rover photo totals
* A live sol counter from the retired endpoint

---

## 2. Mission Catalogue

Mission Control uses a curated catalogue of eight NASA missions.

The mission facts are not automatically updated from a single live NASA REST endpoint.

Mission thumbnails, however, are retrieved from the NASA Image Library.

---

## 3. Upcoming Events

Upcoming Space Events currently uses the available seven-day NeoWs window.

It does not currently represent:

* Every NASA launch
* Every eclipse
* Every orbital insertion
* Every global space event

The module therefore presents the information as **NeoWs close-approach events**, rather than claiming to be a universal space-event calendar.

---

## 4. AI Reliability

The AI model is constrained to the supplied data, but generated language should still be treated as an interpretation layer rather than an authoritative scientific source.

The underlying NASA data remains the source of truth.

---

# 🌟 Why AstroAssist AI?

AstroAssist is built around a simple idea:

```text
More space data
       ≠
Better decisions
```

What matters is turning the data into something humans can understand and act upon.

AstroAssist therefore creates a pipeline:

```text
        RAW SPACE DATA
              ↓
       DATA PROCESSING
              ↓
       STRUCTURED CONTEXT
              ↓
          AI REASONING
              ↓
       HUMAN-READABLE
          INSIGHTS
              ↓
      BETTER DECISIONS
```

This demonstrates how AI can serve as an intelligence layer on top of existing scientific data rather than replacing the underlying data sources.

---

# 🎥 Demo Video

### Public Demo

> **Add your publicly accessible demo video link here**

```text
[Watch the AstroAssist AI Demo](YOUR_YOUTUBE_LINK_HERE)
```

The demo should demonstrate:

1. Dashboard
2. Asteroid Monitor
3. Mars Explorer
4. Mission Control
5. Mission Insights
6. Live AI briefing generation
7. AI response based on NASA data
8. Secure AI proxy architecture

---



# 🏆 Challenge Fit

AstroAssist AI aligns with the IBM August Challenge in multiple areas.

| Challenge Requirement             | AstroAssist Implementation                |
| --------------------------------- | ----------------------------------------- |
| Advance Space Exploration with AI | AI mission intelligence platform          |
| AI as core component              | Four AI-generated insight modules         |
| Improve decision-making           | Converts NASA data into concise briefings |
| Make space data accessible        | Human-readable dashboard                  |
| Space operations                  | Asteroid risk and close-approach analysis |
| Data interpretation               | AI summarisation of NASA datasets         |
| AI-assisted development           | IBM Bob used as primary development tool  |
| Working prototype                 | Fully functional React application        |
| Public GitHub repository          | AstroAssist-AI repository                 |
| Public demo                       | Demo video                                |

---

# 🌍 Real-World Impact

AstroAssist AI demonstrates a foundation that could be expanded into larger mission-support systems.

Potential future applications include:

* Space debris monitoring
* Collision-risk analysis
* Satellite health monitoring
* Mission anomaly detection
* Mission planning assistance
* Scientific research assistants
* Space-weather intelligence
* Multi-source mission dashboards
* Astronaut and rover mission support
* Public space-data education

The current prototype focuses on demonstrating the **core intelligence workflow**:

> **Collect → Understand → Analyse → Explain**

---

# 🚀 Future Improvements

Potential future versions could integrate:

* Live spacecraft telemetry
* Space-weather APIs
* Launch schedules
* Orbital propagation
---



### Demo

**Add your public demo video link here**


# 📚 References

### NASA

* NASA — https://www.nasa.gov/
* NASA Open APIs — https://api.nasa.gov/
* NASA NeoWs — https://api.nasa.gov/
* NASA Image and Video Library — https://images.nasa.gov/

### AI

* Hugging Face — https://huggingface.co/
* Llama — Meta AI
