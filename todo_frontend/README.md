# Simple Todo – Next.js Frontend

A modern single-page Todo application built with Next.js (App Router) and styled with the Ocean Professional theme (blue primary `#2563EB`, amber secondary `#F59E0B`, minimal UI, rounded corners, subtle shadows, gradient accents).

This frontend is self-contained and can operate:
- Against a backend REST API (if available) defined by environment variables.
- With an in-memory fallback when the API is not present (static export friendly).

## Features

- Create, view, toggle complete, edit, and delete todo items
- Ocean Professional UI: modern, minimal, accessible
- API client encapsulated behind a switchable interface
- Graceful in-memory fallback when API is unavailable
- Basic error handling, loading and empty states
- Accessibility: labels, roles, live regions
- Feature flag scaffold via `NEXT_PUBLIC_FEATURE_FLAGS` and `NEXT_PUBLIC_EXPERIMENTS_ENABLED`

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
# open http://localhost:3000
```

To create a production build:

```bash
npm run build
npm start
```

The project is configured with `output: "export"` to support static export.

## Environment Variables

Create a `.env.local` file (see `.env.example` for references). Only PUBLIC variables are read on the client:

- `NEXT_PUBLIC_API_BASE` – Base URL for the backend API (e.g., `https://api.example.com`). If not set, relative paths will be used which enables static operation without a backend, falling back to in-memory storage automatically.
- `NEXT_PUBLIC_BACKEND_URL` – Optional alias for the API base.
- `NEXT_PUBLIC_FRONTEND_URL` – Optional informational URL.
- `NEXT_PUBLIC_WS_URL` – Not used in this app (placeholder for future real-time features).
- `NEXT_PUBLIC_NODE_ENV` – Optional.
- `NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED` – Optional to disable Next.js telemetry.
- `NEXT_PUBLIC_ENABLE_SOURCE_MAPS` – Optional.
- `NEXT_PUBLIC_PORT` – Optional.
- `NEXT_PUBLIC_TRUST_PROXY` – Optional.
- `NEXT_PUBLIC_LOG_LEVEL` – Optional.
- `NEXT_PUBLIC_HEALTHCHECK_PATH` – Optional.
- `NEXT_PUBLIC_FEATURE_FLAGS` – Feature flags as JSON or comma-separated `key=bool` list (e.g., `{"showNewChip": true}` or `showNewChip=true`).
- `NEXT_PUBLIC_EXPERIMENTS_ENABLED` – Global toggle for experiments (`true`/`false`).

No secrets are stored or required by this frontend.

## API Expectations

If a backend is present, the API client expects conventional REST endpoints:
- `GET /todos` -> `TodoItem[]`
- `POST /todos` with `{ title: string }` -> `TodoItem`
- `PATCH /todos/:id` with `{ title?: string; completed?: boolean }` -> `TodoItem`
- `DELETE /todos/:id` -> 204 No Content

If these endpoints are not available or return errors, the client automatically switches to an in-memory store so the UI remains fully functional.

## Feature Flags

- Enable all experiments:
  - `NEXT_PUBLIC_EXPERIMENTS_ENABLED=true`
- Define specific flags:
  - `NEXT_PUBLIC_FEATURE_FLAGS={"showNewChip":true}`
  - or `NEXT_PUBLIC_FEATURE_FLAGS=showNewChip=true`

Example experiment currently used: a small banner chip indicating a new look.

## Code Structure

- `src/app/page.tsx` – Main SPA page
- `src/lib/config.ts` – Env parsing and feature flags
- `src/lib/api.ts` – API client with in-memory fallback
- `src/hooks/useTodos.ts` – State management for list CRUD
- `src/app/globals.css` – Theme and component styles (Tailwind v4)

## Accessibility

- Proper labels for form controls
- Roles for lists and alerts
- Live regions for error/loading states
- Keyboard support for add/edit actions (Enter/Escape)

## Notes

- This container only implements the frontend.
- No hardcoded secrets; configuration via environment variables only.

```text
If you choose to integrate a backend later, provide the API base via NEXT_PUBLIC_API_BASE and ensure endpoints match the expected paths.
```
