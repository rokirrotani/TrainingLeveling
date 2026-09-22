# TrainingLeveling

TrainingLeveling e una mobile-web app full-stack per creare percorsi personalizzati di allenamento e alimentazione con una gamification a livelli stile RPG.

La guida iniziale e Levellino (chibi coach), che raccoglie input utente e avvia il percorso personalizzato con missioni giornaliere, XP, level up e monitoraggio progresso.

## Stack Tecnologico

- Frontend: React + TypeScript + TailwindCSS + Vite
- Backend: Rust + Axum + SQLx
- Database: SQLite (locale, zero setup)
- Orchestrazione locale e deploy base: Docker + Docker Compose

## Struttura Progetto

```
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
		Cargo.toml
		Dockerfile
		.env.example

	frontend/
		src/
			api/
			components/
			hooks/
			utils/
			App.tsx
			main.tsx
			styles.css
			types.ts
		package.json
		tailwind.config.js
		Dockerfile
		.env.example

	docker-compose.yml
	.env.example
	.gitignore
	README.md
```

## Funzionalita MVP Incluse

- Onboarding personalizzato con Levellino
- Form guidato con obiettivo, livello attività, preferenze e stile alimentare
- Generazione piano iniziale custom (allenamento + nutrizione + focus giornaliero)
- Check giornaliero (allenamento, alimentazione, idratazione)
- Sistema XP + livello
- Streak giornaliera
- Dashboard progresso con storico recente

## Immagine Levellino Personalizzata

Per usare un artwork come quello che mi hai mostrato:

1. Salva il file immagine in `frontend/public/levellino-chibi.png`
2. Riavvia il frontend se e gia in esecuzione

Il componente usera automaticamente l'immagine. Se manca il file, torna al badge `LV` come fallback.

## API Disponibili

- `GET /api/health`
- `POST /api/onboarding`
- `POST /api/progress/log`
- `GET /api/progress/:user_id`

## Setup Rapido Locale con Docker (Consigliato)

1. Dalla root progetto:

```bash
docker compose up --build
```

2. Accesso servizi:

- Frontend: `http://localhost:4173`
- Backend: `http://localhost:8080/api/health`
- DB SQLite persistito in volume Docker `sqlite_data`

Le migrazioni SQL vengono applicate all'avvio del backend e il DB viene inizializzato automaticamente.

## Setup Manuale (Senza Docker)

### 1) Backend Rust

```bash
cd backend
copy .env.example .env
cargo run
```

Nota: se non crei `.env`, il backend usa in automatico questo default locale:
`sqlite://training_leveling.db`

### 2) Frontend React

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend locale su `http://localhost:5173`.

## Deploy Online (Pronto per partire)

Il progetto e gia predisposto per deployment containerizzato.

Strategia consigliata:

1. Frontend su Vercel/Netlify (build Vite)
2. Backend Rust container su Render/Fly.io/Railway/Azure Container Apps
3. SQLite per MVP, poi migrazione a MySQL/PostgreSQL quando passi a multi-utente avanzato

### Variabili principali

- Frontend: `VITE_API_BASE_URL`
- Backend: `APP_HOST`, `APP_PORT`, `DATABASE_URL`, `FRONTEND_ORIGIN`

## Note su "immagini Solo Leveling"

Per evitare problemi di copyright, usa asset originali o royalty-free in stile anime/fantasy (non materiale copiato da opere protette).

## Evoluzioni Raccomandate

- Autenticazione (JWT + refresh token)
- Profilo avanzato (massa grassa, target calorie, macro)
- Piano settimanale completo modificabile da UI
- Chat Levellino AI (LLM) con storico conversazioni
- Notifiche push giornaliere
- Upload progress photo e grafici trend
- Ruolo admin/coach per creare template piani

## Stato Attuale

La base full-stack e pronta: file, cartelle, backend, frontend, DB schema, Docker, API e UI iniziale. Da qui puoi iterare su feature premium e design finale.
