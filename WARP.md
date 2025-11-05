# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Install deps: `npm install`
- Dev server (auto-restart): `npm run dev`
- Start (prod-ish): `node src/index.js`
- Lint: `npm run lint` | Fix: `npm run lint:fix`
- Format: `npm run format` | Check: `npm run format-check`
- Database (Drizzle + Neon Postgres)
  - Requires `DATABASE_URL`
  - Generate SQL from models: `npm run db:generate`
  - Apply migrations: `npm run db:migrate`
  - Inspect DB: `npm run db:studio`
- Tests: not configured (`npm test` exits with error). Running a single test is not applicable until a test runner is added.

## Architecture overview

- Runtime: Node.js (ESM) + Express 5
- Entry and boot
  - `src/index.js` loads env and starts `src/server.js`
  - `src/server.js` listens on `PORT` (default 3000) and logs via Winston
- App composition (`src/app.js`)
  - Security & middleware: `helmet`, `cors`, `express.json/urlencoded`, `cookie-parser`, request logging via `morgan` piped to Winston
  - Built-in routes: `/` (hello), `/health` (JSON), `/api` (ping)
  - Feature routes: `/api/auth` → `src/routes/auth.routes.js`
- Auth feature
  - Route → Controller → Service → DB → JWT → Cookie
  - `auth.routes.js` wires endpoints (implemented: `POST /api/auth/sign-up`)
  - `auth.controller.js` validates with Zod, calls service, signs JWT, sets cookie, returns safe user payload
  - `services/auth.service.js` hashes password (bcrypt), uses Drizzle to check/insert user
  - `validations/auth.validation.js` contains Zod schemas
  - `utils/` helpers: `cookies.js`, `format.js` (validation error formatting), `jwt.js` (sign/verify)
- Data layer
  - Drizzle ORM with Neon HTTP driver
  - Schema: `src/models/user.model.js` (users table)
  - Config: `drizzle.config.js` (schema glob `./src/models/*.js`, out `./drizzle`, `DATABASE_URL` required)
  - Connection: `src/config/databse.js` exports `db` and `sql` (Neon)
- Observability
  - `src/config/logger.js` sets up Winston
    - Files: `logs/error.log`, `logs/combined.log`
    - Console logging when `NODE_ENV !== 'production'`
- Tooling
  - ESLint (flat config) in `eslint.config.js`; Prettier in `.prettierrc`

## Environment

- Required for DB/migrations: `DATABASE_URL`
- Common: `PORT` (server), `JWT_SECRET` (JWT signing), `NODE_ENV`, `LOG_LEVEL`
