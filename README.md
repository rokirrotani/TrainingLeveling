# TrainingLeveling

TrainingLeveling e una mobile-web app full-stack che combina:
- onboarding guidato da Levellino
- piani personalizzati allenamento + alimentazione
- sistema XP/Level stile RPG
- monitoraggio giornaliero semplice e motivante

---

## 1) Visione del Progetto

Obiettivo: aiutare l'utente a raggiungere i propri target fitness/alimentazione con una UX leggera, guidata e ad alta costanza.

Punti chiave:
- personalizzazione iniziale tramite domande guidate
- loop giornaliero con missioni rapide
- feedback immediato su progresso, livello e streak
- architettura semplice da avviare in locale e pronta per deploy

---

## 2) Architettura Visuale

### Overview generale

![Architecture Overview](docs/images/architecture-overview.svg)

### Flusso onboarding

![Onboarding Flow](docs/images/onboarding-flow.svg)

### Loop di level-up giornaliero

![Daily Leveling Loop](docs/images/daily-level-loop.svg)

---

## 3) Stack Tecnologico

- Frontend: React + TypeScript + Vite + TailwindCSS
- Backend: Rust + Axum + SQLx
- Database locale: SQLite (zero setup)
- Containerizzazione: Docker + Docker Compose (opzionale)

Perche SQLite ora:
- niente credenziali DB da gestire in locale
- avvio rapido immediato
- file singolo facile da backup

Quando passare a MySQL/PostgreSQL:
- multi-utente ad alto traffico
- analytics avanzate
- scalabilita orizzontale

---

## 4) Mappa dei Collegamenti (Punto a Punto)

### Frontend
- Entry app: [frontend/src/main.tsx](frontend/src/main.tsx)
- Composizione schermata principale: [frontend/src/App.tsx](frontend/src/App.tsx)
- Guida Levellino: [frontend/src/components/LevellinoGuide.tsx](frontend/src/components/LevellinoGuide.tsx)
- Onboarding: [frontend/src/components/OnboardingForm.tsx](frontend/src/components/OnboardingForm.tsx)
- Dashboard e check giornaliero: [frontend/src/components/Dashboard.tsx](frontend/src/components/Dashboard.tsx)
- API client: [frontend/src/api/client.ts](frontend/src/api/client.ts)
- Hook progresso: [frontend/src/hooks/useProgress.ts](frontend/src/hooks/useProgress.ts)
- Persistenza locale: [frontend/src/utils/storage.ts](frontend/src/utils/storage.ts)

### Backend
- Bootstrap server + middleware: [backend/src/main.rs](backend/src/main.rs)
- Config env: [backend/src/config.rs](backend/src/config.rs)
- Stato app (pool DB): [backend/src/state.rs](backend/src/state.rs)
- Router API: [backend/src/routes/mod.rs](backend/src/routes/mod.rs)
- Route health: [backend/src/routes/health.rs](backend/src/routes/health.rs)
- Route onboarding: [backend/src/routes/onboarding.rs](backend/src/routes/onboarding.rs)
- Route progress/log: [backend/src/routes/progress.rs](backend/src/routes/progress.rs)
- Logica XP/Level: [backend/src/services/leveling.rs](backend/src/services/leveling.rs)
- Migrazione schema DB: [backend/migrations/001_init.sql](backend/migrations/001_init.sql)

### Config progetto
- Docker compose: [docker-compose.yml](docker-compose.yml)
- Env root esempio: [.env.example](.env.example)
- Env backend esempio: [backend/.env.example](backend/.env.example)
- Env frontend esempio: [frontend/.env.example](frontend/.env.example)

---

## 5) Flusso Applicativo End-to-End

### 5.1 Onboarding
1. Utente compila form guidato (nickname, obiettivo, preferenze).
2. Frontend invia `POST /api/onboarding`.
3. Backend genera piano personalizzato con regole di domain logic.
4. Backend salva profilo utente nel DB.
5. Frontend salva `user_id` e mostra dashboard con piano.

### 5.2 Daily Loop
1. Utente segna missioni giornaliere completate.
2. Frontend invia `POST /api/progress/log`.
3. Backend calcola XP in base a missioni completate.
4. Backend salva log giornaliero.
5. Frontend aggiorna stato con `GET /api/progress/:user_id`.
6. Utente vede livello, XP, streak e stato missione.

---

## 6) Contratti API (Chiaro e Diretto)

### GET /api/health
- Uso: check rapido stato backend
- Risposta esempio:

```json
{
  "status": "ok",
  "service": "training-leveling-api"
}
```

### POST /api/onboarding
- Uso: creazione profilo + piano iniziale
- Body esempio:

```json
{
  "nickname": "ShadowRunner",
  "age": 26,
  "height_cm": 178,
  "weight_kg": 74,
  "goal": "muscle_gain",
  "activity_level": "intermediate",
  "food_style": "balanced",
  "preferences": ["home_workout", "quick_meals"]
}
```

### POST /api/progress/log
- Uso: salvataggio check giornaliero
- Body esempio:

```json
{
  "user_id": 1,
  "log_date": "2026-09-22",
  "workout_done": true,
  "nutrition_done": true,
  "hydration_done": false,
  "notes": "Oggi buona energia"
}
```

### GET /api/progress/:user_id
- Uso: recupero progresso completo utente
- Include: XP totale, livello, streak, log recenti

---

## 7) Modello Dati

Tabelle principali:
- `user_profiles`
  - profilo e preferenze base utente
- `daily_logs`
  - missioni giornaliere, XP ottenuto, nota, data

Relazione:
- `daily_logs.user_id` -> `user_profiles.id` (1:N)

---

## 8) Setup Locale (Consigliato)

Prerequisiti:
- Node.js installato
- Rust toolchain installata

### 8.1 Backend

```bash
cd backend
copy .env.example .env
cargo run
```

Backend API su:
- http://localhost:8080/api/health

### 8.2 Frontend

In un secondo terminale:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend su:
- http://localhost:5173

---

## 9) Setup con Docker (Opzionale)

Se Docker Desktop e disponibile:

```bash
docker compose up --build
```

Servizi:
- Frontend: http://localhost:4173
- Backend: http://localhost:8080/api/health

---

## 10) Immagine Levellino Personalizzata

Per usare un artwork custom:
1. salva l'immagine in `frontend/public/levellino-chibi.png`
2. riavvia frontend

Il componente Levellino usera automaticamente l'immagine.
Se il file manca, resta il fallback grafico LV.

---

## 11) Struttura Cartelle

```text
TrainingLeveling/
  backend/
    migrations/
      001_init.sql
    src/
      routes/
      services/
      config.rs
      main.rs
      models.rs
      state.rs
    .env.example
    Cargo.toml
    Dockerfile

  frontend/
    public/
    src/
      api/
      components/
      hooks/
      utils/
      App.tsx
      main.tsx
      styles.css
      types.ts
    .env.example
    package.json
    tailwind.config.js
    vite.config.ts
    Dockerfile

  docs/
    images/
      architecture-overview.svg
      onboarding-flow.svg
      daily-level-loop.svg

  docker-compose.yml
  .env.example
  README.md
```

---

## 12) Roadmap Evolutiva

- autenticazione JWT + refresh token
- profilo avanzato con macro/calorie dinamiche
- chat Levellino AI con coaching contestuale
- notifiche push missione giornaliera
- analytics trend settimanale/mensile
- migrazione DB a MySQL/PostgreSQL per scalare

---

## 13) Stato Attuale

La base e gia operativa end-to-end:
- frontend completo
- backend API completo
- database locale auto-migrato
- UX con onboarding, piano, check giornaliero e leveling
- documentazione tecnica completa con diagrammi
