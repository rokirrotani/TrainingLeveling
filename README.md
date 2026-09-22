<p align="center">
  <img src="docs/images/hero-levellino.svg" alt="TrainingLeveling Hero" width="100%" />
</p>

<h1 align="center">TrainingLeveling</h1>

<p align="center">
  Mobile-web app con onboarding guidato, piani personalizzati, missioni giornaliere, XP e level-up.
</p>

<p align="center">
  <img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-0ea5e9" />
  <img alt="Backend" src="https://img.shields.io/badge/Backend-Rust%20%2B%20Axum-1d4ed8" />
  <img alt="Database" src="https://img.shields.io/badge/Database-SQLite-334155" />
  <img alt="Runtime" src="https://img.shields.io/badge/Runtime-Docker%20ready-0f172a" />
</p>

---

## Nota su immagine "Solo Leveling"

Per policy copyright non includo immagini ufficiali protette da franchise nel repository.
Hai pero due opzioni:
1. Usare il visual hero originale gia presente in [docs/images/hero-levellino.svg](docs/images/hero-levellino.svg).
2. Sostituire il file hero con una tua immagine licenziata/di cui possiedi i diritti.

---

## Indice

- [Quick Start](#quick-start)
- [Percorso Utente e Tecnico](#percorso-utente-e-tecnico)
- [Architettura Visuale Completa](#architettura-visuale-completa)
- [Mappa Codice con Collegamenti](#mappa-codice-con-collegamenti)
- [Docker Topology](#docker-topology)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Runbook Avvio](#runbook-avvio)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Avvio locale diretto

```bash
cd backend
copy .env.example .env
cargo run
```

Secondo terminale:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

URL:
- Frontend: http://localhost:5173
- Backend health: http://localhost:8080/api/health

### Avvio con Docker (se installato)

```bash
docker compose up --build
```

URL:
- Frontend: http://localhost:4173
- Backend health: http://localhost:8080/api/health

---

## Percorso Utente e Tecnico

### User Journey

```mermaid
flowchart LR
    A[Utente apre app] --> B[Onboarding con Levellino]
    B --> C[Scelta obiettivo e preferenze]
    C --> D[Generazione piano personalizzato]
    D --> E[Check giornaliero missioni]
    E --> F[XP, livello, streak]
    F --> G[Monitoraggio progressi]
    G --> E
```

### Technical Request Flow

```mermaid
sequenceDiagram
    participant U as User Browser
    participant F as Frontend React
    participant B as Backend Rust
    participant D as SQLite

    U->>F: Compila onboarding
    F->>B: POST /api/onboarding
    B->>D: INSERT user_profiles
    B-->>F: user_id + piano

    U->>F: Invia check giornaliero
    F->>B: POST /api/progress/log
    B->>D: INSERT daily_logs
    B-->>F: log creato

    F->>B: GET /api/progress/:id
    B->>D: SELECT progress + logs
    B-->>F: xp, level, streak, storico
```

---

## Architettura Visuale Completa

### 1) Overview architettura

![Architecture Overview](docs/images/architecture-overview.svg)

### 2) Flusso onboarding

![Onboarding Flow](docs/images/onboarding-flow.svg)

### 3) Daily leveling loop

![Daily Leveling Loop](docs/images/daily-level-loop.svg)

### 4) Mappa struttura codice

![Code Structure Map](docs/images/code-structure-map.svg)

### 5) Topologia Docker/runtime

![Docker Stack](docs/images/docker-stack.svg)

### 6) Schema database

![Database Schema](docs/images/db-schema.svg)

---

## Mappa Codice con Collegamenti

### Frontend

| Modulo | Scopo |
|---|---|
| [frontend/src/main.tsx](frontend/src/main.tsx) | Entry point React |
| [frontend/src/App.tsx](frontend/src/App.tsx) | Shell principale + routing UI base |
| [frontend/src/components/LevellinoGuide.tsx](frontend/src/components/LevellinoGuide.tsx) | Hero/guida Levellino |
| [frontend/src/components/OnboardingForm.tsx](frontend/src/components/OnboardingForm.tsx) | Form onboarding utente |
| [frontend/src/components/Dashboard.tsx](frontend/src/components/Dashboard.tsx) | Dashboard, missioni, progresso |
| [frontend/src/api/client.ts](frontend/src/api/client.ts) | Chiamate HTTP al backend |
| [frontend/src/hooks/useProgress.ts](frontend/src/hooks/useProgress.ts) | Hook stato progresso |
| [frontend/src/utils/storage.ts](frontend/src/utils/storage.ts) | Persistenza locale user/onboarding |
| [frontend/src/types.ts](frontend/src/types.ts) | Tipi TypeScript condivisi |

### Backend

| Modulo | Scopo |
|---|---|
| [backend/src/main.rs](backend/src/main.rs) | Bootstrap server, CORS, migration startup |
| [backend/src/config.rs](backend/src/config.rs) | Config ENV e default runtime |
| [backend/src/state.rs](backend/src/state.rs) | Stato globale app (pool DB) |
| [backend/src/models.rs](backend/src/models.rs) | DTO request/response + entity log |
| [backend/src/routes/mod.rs](backend/src/routes/mod.rs) | Registrazione route API |
| [backend/src/routes/health.rs](backend/src/routes/health.rs) | Endpoint health |
| [backend/src/routes/onboarding.rs](backend/src/routes/onboarding.rs) | Creazione profilo + piano |
| [backend/src/routes/progress.rs](backend/src/routes/progress.rs) | Log giornaliero + progress retrieval |
| [backend/src/services/leveling.rs](backend/src/services/leveling.rs) | Regole XP e level computation |
| [backend/migrations/001_init.sql](backend/migrations/001_init.sql) | Schema SQLite iniziale |

### Infra/Config

| File | Scopo |
|---|---|
| [docker-compose.yml](docker-compose.yml) | Runtime container frontend/backend + volume SQLite |
| [backend/.env.example](backend/.env.example) | Env backend di riferimento |
| [frontend/.env.example](frontend/.env.example) | Env frontend di riferimento |
| [.env.example](.env.example) | Template env root |

---

## Docker Topology

Composizione stack docker:
- frontend container serve asset statici
- backend container espone API Rust
- volume sqlite persistente per dati app

File chiave:
- [docker-compose.yml](docker-compose.yml)
- [backend/Dockerfile](backend/Dockerfile)
- [frontend/Dockerfile](frontend/Dockerfile)

---

## Database Schema

Schema attuale (SQLite):
- `user_profiles`: profilo base utente
- `daily_logs`: log giornalieri e XP
- relazione 1:N su `user_id`

Schema definito in:
- [backend/migrations/001_init.sql](backend/migrations/001_init.sql)

---

## API Endpoints

### GET /api/health
Controllo stato backend.

### POST /api/onboarding
Crea profilo utente e ritorna piano iniziale.

### POST /api/progress/log
Registra completamento missioni giornaliere e calcola XP.

### GET /api/progress/:user_id
Ritorna livello, XP, streak e storico log.

---

## Runbook Avvio

### Modalita sviluppo
1. Avvia backend da [backend](backend)
2. Avvia frontend da [frontend](frontend)
3. Apri URL frontend
4. Verifica health API

### Modalita container
1. Verifica docker installato
2. Avvia `docker compose up --build`
3. Apri frontend su porta 4173

---

## Troubleshooting

### Errore `Failed to fetch` nel frontend
- verifica backend su http://localhost:8080/api/health
- controlla [frontend/.env](frontend/.env) con `VITE_API_BASE_URL=http://localhost:8080`

### Porta occupata
- backend usa 8080
- frontend usa 5173 (dev) o 4173 (docker)

### DB non accessibile
- in locale usa SQLite automatico (nessuna credenziale richiesta)
- controlla file DB in [backend/training_leveling.db](backend/training_leveling.db)

---

## Estensioni Future

- auth JWT + refresh token
- motore piani avanzato con macro/calorie
- notifiche e reminder
- analytics avanzate
- migrazione opzionale a PostgreSQL/MySQL per scala enterprise
