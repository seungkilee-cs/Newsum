# Test Procedures — 2025-10-02 13:12 JST

## Backend (`backend/`)
- [install] `cd backend && npm install`
- [env] Copy `backend/.env.example` to `.env` and adjust `MONGODB_URI`, `SESSION_SECRET`, `CLIENT_ORIGINS`
- [lint] `npm run lint`
- [unit tests] `npm test` (placeholder currently runs Node test runner; add suites under `backend/tests/`)
- [integration: API] Start MongoDB (e.g., `docker run --name newsum-mongo -p 27017:27017 mongo:7`) and run `npm run dev`
- [integration: ingestion] `curl -X POST http://localhost:5001/api/articles/mongo-receive \`<br>`  -H 'Content-Type: application/json' \`<br>`  -d @sample_articles.json` (Use `backend/_test/sample_articles.json`)
- [integration: auth]
  - `curl -X POST http://localhost:5001/api/users/register -H 'Content-Type: application/json' -d '{"username":"testuser","email":"user@test.com","password":"Password123"}'`
  - `curl -X POST http://localhost:5001/api/users/login -H 'Content-Type: application/json' -d '{"identifier":"testuser","password":"Password123"}'`
  - Verify session cookie and logout via `curl -X POST http://localhost:5001/api/users/logout`
- [integration: sites] `curl http://localhost:5001/api/sites`
- [health] Monitor logs for validation errors and ensure responses return expected pagination shape from `GET /api/articles/mongo?limit=5&page=1`

## Frontend (`frontend/`)
- [install] `cd frontend && npm install`
- [env] Create `.env.local` with `VITE_API_BASE_URL=http://localhost:5001` and optional `VITE_APP_ENVIRONMENT=development`
- [lint/tests] (If eslint/jest configured) `npm run lint`, `npm test`
- [run dev] `npm run dev` (Vite) and confirm UI on `http://localhost:5173`
- [manual flows]
  - Register account and verify success toast + redirect
  - Login with created credentials, confirm navigation to `/sites`
  - Select a site -> ensure `CarouselView` populates summaries, formatted dates, and deep link reload works
  - Toggle local storage by clearing `selectedSite` and reload to confirm rehydration
  - Disconnect backend to confirm graceful error messaging
- [build] `npm run build` and `npm run preview` for production bundle smoke test

## Scraper (`scraper/`)
- [env] Create `.env` with overrides as needed:
  - `SCRAPER_API_BASE_URL=http://localhost:5001`
  - `SCRAPER_USE_TEST_SUMMARY=true` (or false with valid API key)
  - `TEST_OPENAI_API_KEY=...` when using live summaries
- [install] `pip install -r scraper/requirements.txt` (prefer virtualenv)
- [lint] (optional) `ruff check scraper/` or `flake8 scraper/`
- [dry run] `python scraper/scraper.py` (default site `alm`) while backend is running; confirm console logs show collected articles and successful ingestion
- [site override] Run `python scraper/scraper.py --site other_site_key` once additional configs exist
- [error handling] Simulate network failure (disconnect) and ensure retries/backoff messages appear without crash
- [legacy compat] If using old `tmp.py`, verify `from data_sender import send_to_backend` still functions

## Cross-module Regression
- [end-to-end] Run scraper to ingest data, load frontend, and ensure new summaries appear
- [monitor] Check backend logs for validation errors and MongoDB for inserted `Article` documents
- [cleanup] Stop services (`npm run dev` ctrl+c, `docker stop newsum-mongo`) and prune test data if needed
