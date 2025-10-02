# Feature-to-Test Workflow

Use this guide when translating a new feature idea into backend + frontend implementation and automated tests. It emphasizes focusing on observable behavior instead of internal code structure.

## 1. Define the Feature in Terms of User Value
- **Describe the user story**: who needs the feature and why.
- **List acceptance criteria**: observable outcomes the user or system should experience.
- **Identify entry points**: APIs, UI interactions, background jobs.

## 2. Map Feature to Backend Responsibilities
- **Entities & Data**: Determine new or updated models/collections.
- **Endpoints & Methods**: Sketch REST endpoints (method + path) that fulfill acceptance criteria.
- **Validations & Rules**: Specify input requirements and error cases using schemas (`zod`, etc.).
- **Side effects**: Note jobs, events, or downstream updates triggered by the feature.

*Tip: keep a living spec under `docs/architecture/feature-name.md` for complex features.*

## 3. Design Frontend Responsibilities
- **State & UI components**: Identify which components render the feature and how data flows through stores/state.
- **API integration**: Outline which backend endpoints the frontend will call and how responses shape UI.
- **User interactions**: Capture form submissions, navigation, and success/error handling.

## 4. Break Down Implementation Tasks
- **Backend tasks**: models, controllers, routes, validators, tests.
- **Frontend tasks**: components, hooks, API clients, styling, tests.
- **Shared contracts**: ensure request/response DTOs are documented and aligned.

Use TODO lists or project trackers to keep scope clear.

## 5. Derive Test Scenarios from Acceptance Criteria
- **Backend tests**
  - Happy path integration tests using Supertest (mirror manual `curl` flows).
  - Edge cases: validation failures, unauthorized access, empty results.
- **Frontend tests**
  - Unit/component tests asserting rendering, state updates, and error messaging.
  - End-to-end flows (Playwright/Cypress) covering critical user journeys.
- **Contract tests (optional)**
  - Validate that backend responses match frontend expectations (e.g., using `zod` or `io-ts` on the client).

## 6. Focus on Behavior-Driven Testing
- **Avoid implementation coupling**: tests should assert outputs and side effects, not private functions or exact state internals.
- **Use public APIs**: interact with services through exposed routes or component props.
- **Validate observable results**: status codes, response payloads, DOM changes, database state.

## 7. Translate Manual Checks into Automation
- **Record manual steps**: write down `curl` commands or UI actions used to verify the feature.
- **Convert to automated scripts**: use the manual-to-automated template (`docs/testing/manual-to-automated-template.md`) to create Jest/Supertest suites and frontend tests.
- **Ensure repeatability**: seed data and reset state in setup/teardown hooks so tests produce consistent outcomes.

## 8. Integrate Into CI Pipeline
- **Combine scripts**: `npm run ci` should run lint + backend tests; add frontend `npm run test:unit`/`npm run test:e2e` where relevant.
- **CI config**: update GitHub Actions or your CI provider to execute the full suite on pull requests.
- **Monitoring**: review test failures quickly to catch regressions before merge.

## 9. Document & Share
- **Update testing guide**: add new instructions to `docs/test/` detailing how to run feature-specific tests.
- **Communicate coverage**: note which acceptance criteria are automated, and which are manual until tests exist.
- **Plan follow-ups**: log TODOs for remaining test gaps or future enhancements.

---
**Remember:** a good test suite validates behavior from the outside in. Treat the implementation as a black box—verify that given inputs (HTTP requests, user clicks) produce expected outputs (responses, UI changes, DB mutations) without asserting how the internals are structured.
