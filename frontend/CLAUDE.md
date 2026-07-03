# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A teaching project: a FastAPI blog/CMS backend that a frontend intern integrates against. `frontend/` is intentionally empty (to be filled by the intern). The API deliberately has **no authentication** — keep it that way unless explicitly asked, since the point is a low-friction target for frontend practice.

The git root is one level up (`../`) and is a monorepo of unrelated practice projects (`backend-fake-json`, `next13-starter-typescript`). Work stays inside `blog-api/` unless told otherwise.

## Commands

All commands run from `backend/`.

```bash
# Run everything (API + Postgres, seeds sample data on first boot)
docker compose up --build

# Local dev without Docker (needs a running Postgres)
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m app.seed          # optional: load sample categories + blogs
uvicorn app.main:app --reload

# Just Postgres via Docker, app running locally against it
docker compose up db
```

Interactive docs (the intern's main tool): http://localhost:8000/docs

There is no test suite or linter configured. Behavior was validated with an ad-hoc `TestClient` smoke script against SQLite — if you write similar checks, note that **tables are created in the app's `lifespan`, so `TestClient` must be used as a context manager** (`with TestClient(app) as c:`) or the tables won't exist.

## Architecture

Standard layered FastAPI app under `backend/app/`, with a clean separation that's worth preserving:

- **`main.py`** — app factory, CORS, mounts routers under `/api`. Creates tables via `Base.metadata.create_all` in the `lifespan` handler (no Alembic; swap in migrations if the schema starts evolving).
- **`routers/`** (`blogs.py`, `categories.py`) — HTTP layer only: parse/validate, call `crud`, map missing rows to 404. No DB logic here.
- **`crud.py`** — all SQLAlchemy queries. Routers never touch the ORM directly.
- **`models.py`** — SQLAlchemy 2.0 typed models (`Mapped[...]`). `Blog` has `category_id` and `author_id`, both `ON DELETE SET NULL`: deleting a category/author keeps the posts and nulls the FK.
- **`schemas.py`** — Pydantic v2. Note the split: list endpoints return `BlogOut` (flat, no relations, avoids N+1); detail/create/update return `BlogWithRelations` (embeds `category` + `author`). `read_time_minutes` is a `@computed_field` derived from `content` (not stored). `excerpt` is auto-derived from `content` in `crud` when omitted.
- **`config.py`** — `pydantic-settings`; reads `DATABASE_URL` and `CORS_ORIGINS` from env/`.env`.
- **`utils.py` / `seed.py`** — `slugify` + idempotent sample-data loader.

### Conventions to follow

- **Slugs are server-generated and unique.** `crud._unique_slug` derives a slug from title/name when the client omits it and de-duplicates collisions (`hello-world`, `hello-world-2`, ...). Don't trust client-supplied slugs to be unique.
- **DB URL uses the psycopg 3 driver**: `postgresql+psycopg://...` (not `postgresql://`). Keep this prefix in configs and compose files.
- When adding an endpoint, keep the layering: router → `crud` → model. Add request/response shapes to `schemas.py`.
