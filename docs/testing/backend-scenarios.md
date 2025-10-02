# Backend Test Scenarios

This document tracks behavior-driven scenarios for the backend along with their automated coverage. Treat each scenario as a high-level contract; the Jest/Supertest suites implement the corresponding checks.

## Scenario Catalogue

### Scenario A: Ingesting Articles
- **Given** the ingestion endpoint is available and MongoDB is empty.
- **When** a client posts a valid array of articles to `POST /api/articles/mongo-receive`.
- **Then** the API responds with HTTP 200, echoes the number of stored articles, and articles become queryable.
- **Automation**: `tests/article.integration.test.js` (`beforeEach` posts `sampleArticles` and asserts response count).
- **Notes**: Mirrors the manual `curl` call in `docs/test/2025-10-02-testing-guide.md`.

### Scenario B: Paginating Articles
- **Given** previously ingested articles exist in MongoDB.
- **When** a client requests `GET /api/articles/mongo?limit=5&page=1`.
- **Then** the API responds with HTTP 200, returns an array of articles, and includes pagination metadata `{ page: 1, limit: 5 }`.
- **Automation**: `tests/article.integration.test.js` (second test case verifies array length and pagination object).
- **Notes**: Ensures retrieval flow works after ingestion.

### Scenario C: Rejecting Invalid Article Payloads *(Planned)*
- **Given** the ingestion endpoint receives malformed data (e.g., missing `site`).
- **When** the client posts invalid payloads.
- **Then** the API should return HTTP 400 with validation errors from `articleArraySchema`.
- **Automation**: _To be implemented_ — new Supertest case sending malformed payload.

### Scenario D: Listing Sites *(Planned)*
- **Given** site definitions exist in MongoDB.
- **When** a client calls `GET /api/sites`.
- **Then** the API returns HTTP 200 with an array of site metadata (name, selectors, etc.).
- **Automation**: _To be implemented_ — `tests/site.integration.test.js` seeding a site and asserting the response.

### Scenario E: User Registration *(Planned)*
- **Given** no user account exists.
- **When** a client submits a valid payload to `POST /api/users/register`.
- **Then** the API responds with HTTP 201/200, stores a hashed password, and prevents duplicates.
- **Automation**: _To be implemented_ — Supertest flow checking DB contents via models or follow-up login.

### Scenario F: Login & Session Persistence *(Planned)*
- **Given** a registered user and active session middleware.
- **When** the user logs in via `POST /api/users/login`.
- **Then** the API returns success, sets a session cookie, and allows access to protected routes until logout.
- **Automation**: _To be implemented_ — Supertest preserving cookies with `.agent()` and verifying session state.

### Scenario G: Logout *(Planned)*
- **Given** an authenticated session.
- **When** the client calls `POST /api/users/logout`.
- **Then** the session is destroyed and subsequent protected requests fail.
- **Automation**: _To be implemented_ — extend login test to logout and check session invalidation.

### Scenario H: Health/Logging *(Planned)*
- **Given** the server is running.
- **When** any request is made.
- **Then** the middleware logs the route and returns consistent error responses for unknown endpoints.
- **Automation**: _To be implemented_ — tests verifying 404 responses and optional log spies.

## Managing Scenarios
- **Documentation-first**: Record new scenarios here before writing tests so requirements stay visible.
- **Link to tests**: Each scenario should reference the Jest file and test name covering it.
- **Gap tracking**: Scenarios marked “Planned” highlight missing automation; prioritize adding tests for high-impact flows (auth, sites).
- **Review cadence**: Update this file during retrospectives to ensure documentation matches actual coverage.

## Current Automated Test Inventory
- **Article ingestion** (`tests/article.integration.test.js` – Scenario A).
- **Article pagination** (`tests/article.integration.test.js` – Scenario B).

## Candidate Features for Additional Tests
- **Validation failures** (Scenario C).
- **Site listing and CRUD** (Scenario D plus future create/update scenarios).
- **User lifecycle** (Scenarios E–G).
- **Error handling / 404 responses** (Scenario H).
- **Authentication guards** once protected routes are introduced.

Use this document alongside `docs/testing/manual-to-automated-template.md` and `docs/testing/feature-to-test-workflow.md` to drive BDD-style coverage for every backend feature.
