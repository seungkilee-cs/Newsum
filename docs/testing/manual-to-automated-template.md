# Manual-to-Automated Testing Template

Use this checklist to convert any manual test flow (e.g., `curl` commands) into an automated Jest + Supertest suite. Adapt the commands/tools to match your stack, and see the concrete "Newsum" examples under each step for reference.

## 1. Capture Manual Test Scenarios
- **Document each manual step**: method, URL, payload, headers, expected response/body.
  - *Newsum example*: Logged `curl` calls for `/api/articles/mongo-receive`, `/api/articles/mongo`, `/api/users/register`, etc. in `docs/test/2025-10-02-testing-guide.md`.
- **Identify environment needs**: databases, services, credentials.
  - *Newsum example*: Recorded requirement for MongoDB (Docker or local) and `.env` values (`MONGODB_URI`, `SESSION_SECRET`).
- **Note assertions**: what you manually inspected (status codes, JSON shape, side effects).
  - *Newsum example*: Checked success message, article count, and MongoDB inserts after each `curl`.

## 2. Prepare the Test Environment
- **Export the app/server**: ensure your Express (or equivalent) instance can be imported without starting the listener (e.g., `export const app` in `backend/app.js`).
  - *Newsum example*: Refactored `backend/app.js` to export `app` and `connectDB()` while only calling `app.listen()` when `NODE_ENV !== "test"`.
- **Isolate dependencies**: choose mocking vs. real service. For databases, prefer an in-memory server (e.g., `mongodb-memory-server`).
  - *Newsum example*: Added `mongodb-memory-server` to `devDependencies` and wired it through Jest setup.
- **Create setup hooks**: add a Jest setup file to start services before tests and clean up afterward (`tests/setup.js`).
  - *Newsum example*: `backend/tests/setup.js` spins up the in-memory Mongo instance and truncates collections after each test.

## 3. Seed Test Data Programmatically
- **Translate manual seed steps**: convert sample payloads into fixtures inside the test.
  - *Newsum example*: Converted `_test/sample_articles.json` payload into `sampleArticles` array inside `article.integration.test.js`.
- **Use lifecycle hooks**: populate data in `beforeEach`/`beforeAll` rather than shell scripts.
  - *Newsum example*: Posted `sampleArticles` in `beforeEach` so every test starts from a known database state.

## 4. Implement Automated Requests
- **Use Supertest or similar**: replicate each `curl` call with `request(app).METHOD(path)`.
  - *Newsum example*: `request(app).post("/api/articles/mongo-receive").send(sampleArticles)` replaced the manual POST.
- **Send payloads**: `.send(body)` for POST/PUT, `.query(params)` for query strings.
  - *Newsum example*: `.query({ limit: 5, page: 1 })` mirrored manual pagination verification for `/api/articles/mongo`.

## 5. Replace Visual Checks with Assertions
- **Status codes**: expect HTTP responses (`.expect(200)` etc.).
  - *Newsum example*: `.expect("Content-Type", /json/).expect(200)` asserted the API contract.
- **Response body**: assert JSON structure/content (`expect(res.body).toMatchObject(...)`).
  - *Newsum example*: `expect(res.body.count).toBe(sampleArticles.length)` validated the ingestion result.
- **Side effects**: verify database writes, emitted events, etc.
  - *Newsum example*: `expect(res.body.data.length).toBeGreaterThan(0)` confirmed retrieval after ingestion.

## 6. Reset State Between Tests
- **Database cleanup**: truncate collections or use transaction rollbacks in `afterEach`.
  - *Newsum example*: `tests/setup.js` iterates collections and calls `deleteMany({})` after each test.
- **Mocks and timers**: restore as needed.
  - *Newsum example*: Not required yet; future tests can reset jest mocks within hooks.

## 7. Configure Jest Runner
- **Add dependencies**: `jest`, `supertest`, `mongodb-memory-server`, `cross-env`, `tslib`.
  - *Newsum example*: Added these to `backend/package.json` devDependencies.
- **Config files**: `jest.config.js` referencing setup file, disable unnecessary transforms.
  - *Newsum example*: `backend/jest.config.js` sets `setupFilesAfterEnv` and keeps transforms empty for native ESM.
- **Scripts**: update `package.json` with `"test": "cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand"`.
  - *Newsum example*: Defined `npm test` and `npm run ci` (lint + tests) in `backend/package.json`.

## 8. Run and Iterate
- **Execute**: `npm test` (or equivalent) to run the automated suite.
  - *Newsum example*: Command logs show Mongo in-memory spin-up, route logging, and final Jest summary.
- **Refine**: expand coverage, add negative cases, integrate with CI (`npm run ci`).
  - *Newsum example*: Next targets include auth and site endpoints plus GitHub Actions workflow.
- **Document**: update project docs with how to run automated tests and the manual-to-automated mapping.
  - *Newsum example*: Captured process in `docs/test/2025-10-02-testing-guide.md` and this template.

## Quick Reference
```text
1. Capture manual steps
2. Prep importable server + test env
3. Seed data via hooks
4. Automate requests (Supertest)
5. Assert responses/side-effects
6. Reset state each test
7. Configure Jest + scripts
8. Run, iterate, document
```
