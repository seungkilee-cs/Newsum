# Backend Features Overview

## High-Level Architecture
- **Framework**: `Express` server (`backend/app.js`) exposing REST APIs.
- **Database**: MongoDB via `mongoose`, storing articles, sites, and users.
- **Session Management**: `express-session` with cookie-based sessions and CORS allowlist (`CLIENT_ORIGINS`).
- **Validation**: `zod` schemas in `backend/validators/` for request payloads.
- **Controllers**: Request handling in `backend/controllers/` with separation by resource (articles, sites, users).
- **Routes**: `backend/routes/` wiring controller actions to `/api/...` endpoints.
- **Utilities**: Helpers under `backend/utils/` for normalization, seeding, etc.

## Feature Breakdown

### 1. Article Ingestion & Retrieval
- **Purpose**: Accept scraped article payloads, normalize, and store in Mongo; expose search/pagination.
- **Key Files**:
  - `backend/controllers/articleController.js`
  - `backend/validators/articleSchemas.js`
  - `backend/utils/articleUtils.js`
- **Flow**:
  1. Client posts article array to `/api/articles/mongo-receive`.
  2. `articleArraySchema` validates required fields (`title`, `url`, `site`, `content`, `summary`).
  3. Controller normalizes payload, upserts into Mongo (`Article` model).
  4. `GET /api/articles/mongo` returns paginated, filterable results.
- **Automation Mapping**:
  - Manual `curl` → Supertest in `tests/article.integration.test.js` verifying both ingest and retrieval.
  - In-memory Mongo ensures isolation per test run (`tests/setup.js`).

### 2. Site Management
- **Purpose**: Serve configured news sites and allow CRUD adjustments.
- **Key Files**:
  - `backend/controllers/siteController.js`
  - `backend/validators/siteSchemas.js`
  - `backend/routes/siteRoutes.js`
- **Flow**:
  1. Frontend requests `GET /api/sites` for site metadata (name, selectors, etc.).
  2. Admin endpoints (planned) allow adding/updating site definitions with schema validation.
- **Automation Mapping**:
  - Current manual test: `curl http://localhost:5001/api/sites`.
  - Future automation: create `tests/site.integration.test.js` to seed sample site documents, assert list and creation responses.

### 3. User Authentication & Sessions
- **Purpose**: Register, login, logout users with hashed passwords and managed sessions.
- **Key Files**:
  - `backend/controllers/userController.js`
  - `backend/models/user.js`
  - `backend/validators/userSchemas.js`
  - `backend/routes/userRoutes.js`
- **Flow**:
  1. `POST /api/users/register` validates payload, hashes password (`bcryptjs`), saves user.
  2. `POST /api/users/login` verifies credentials, initializes session, returns user profile.
  3. `POST /api/users/logout` destroys session.
- **Automation Mapping**:
  - Manual `curl` scripts for register/login/logout documented in `docs/test/2025-10-02-testing-guide.md`.
  - Future automated suite: chain Supertest requests to register → login → access protected route → logout, asserting session cookies.

### 4. Health & Middleware
- **Purpose**: Provide consistent logging, error handling, and configuration.
- **Key Files**:
  - `backend/app.js`
  - `backend/routes/index.js`
- **Flow**:
  1. Global middleware logs every request (temporary console logs).
  2. Session + CORS configuration uses environment-driven allowlist.
  3. Errors propagate via Express handlers (opportunity to centralize responses).
- **Automation Mapping**:
  - Linting ensures middleware hygiene (`npm run lint`).
  - Future tests can assert 404/500 handlers and log outputs.

## End-to-End Flow
1. **Scraper → Backend**: `scraper/scraper.py` collects articles, posts to `/api/articles/mongo-receive`.
2. **Backend Persistence**: Article controller upserts records; Mongo stores normalized data.
3. **Frontend Consumption**: `frontend/` queries `/api/sites` for configuration, `/api/articles/mongo` for summaries.
4. **User Interactions**: Users create accounts, log in, browse sites/articles.
5. **Sessions & Security**: Session middleware ties requests to authenticated users, CORS ensures allowed origins.

## Test Coverage Matrix
| Feature | Endpoint(s) | Manual Tests | Automated Tests |
|---------|-------------|--------------|-----------------|
| Article ingestion & retrieval | `POST /api/articles/mongo-receive`, `GET /api/articles/mongo` | `curl` scripts in testing guide | `tests/article.integration.test.js` (Supertest) |
| Site management | `GET /api/sites` | `curl http://localhost:5001/api/sites` | _Planned_: `tests/site.integration.test.js` |
| User auth & sessions | `POST /api/users/register`, `login`, `logout` | Manual `curl` sequence | _Planned_: `tests/auth.integration.test.js` |
| Middleware / sessions | N/A (global) | Observed logs during manual runs | Covered implicitly once auth tests land |

## Next Steps
- Automate site + auth flows with Supertest + in-memory Mongo.
- Centralize error handling and add tests for failure paths (invalid payloads, unauthorized access).
- Integrate `npm run ci` (lint + tests) into GitHub Actions for continuous verification.
