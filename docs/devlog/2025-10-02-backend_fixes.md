# 2025-10-02 Backend Fixes

## Overview
- **Focus**: Hardened backend ingestion, validation, authentication, and configuration following architectural review.

## Changes
- **Added structured validation middleware** (`backend/middleware/validateRequest.js`)
  - Introduced reusable Zod-based validator to enforce request schemas before controllers execute.
- **Defined schemas for articles and sites** (`backend/validators/articleSchemas.js`, `backend/validators/siteSchemas.js`)
  - Ensures ingestion payloads include required fields and gracefully handle optional metadata.
- **Normalized article handling** (`backend/utils/articleUtils.js`, `backend/controllers/articleController.js`)
  - Convert incoming payloads into consistent structure, upsert into Mongo, and expose paginated/filterable retrieval with richer error reporting.
- **Secured user authentication pipeline** (`backend/models/user.js`, `backend/controllers/userController.js`, `backend/routes/userRoutes.js`, `backend/validators/userSchemas.js`)
  - Added bcrypt hashing, register/login/logout endpoints, session integration, and payload validation to eliminate plaintext passwords.
- **Improved session and CORS configuration** (`backend/app.js`)
  - Configured origin allowlist, credentialed CORS, cookie settings, and session secret fallback for safer deployments.
- **Tooling and configuration enhancements** (`backend/package.json`, `backend/.env.example`)
  - Added ESLint script, bcrypt/zod dependencies, and sample environment file for smoother onboarding.
- **Dependency patching** (`backend/package.json`)
  - Bumped `axios` to ^1.12.0 and `express-session` to ^1.18.1; added overrides for `form-data`, `brace-expansion`, and `on-headers` to resolve npm audit findings.
- **Lint configuration** (`backend/eslint.config.js`)
  - Introduced flat ESLint config compatible with v9 runner to unblock `npm run lint`.

## Follow-ups
- Add automated tests for new validators and controllers (`backend/package.json:test`).
- Extend validation to user preference endpoints and other controllers.
- Implement production-grade session store (Redis) before launch.
