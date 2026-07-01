# Blog / CMS API

A simple FastAPI backend for a blog / CMS, built for frontend interns to practice
API integration. **No authentication** — every endpoint is open.

## Features

- Blogs and Categories with full CRUD
- List & filter blogs (by category, published state, title search) with pagination
- List blogs within a category
- Auto-generated URL slugs
- PostgreSQL storage
- Interactive docs at `/docs` (Swagger) and `/redoc`
- Dockerfile + docker-compose (API + Postgres) ready for CI/CD

## Tech stack

FastAPI · SQLAlchemy 2 · Pydantic v2 · PostgreSQL (psycopg 3) · Uvicorn

---

## Quick start (Docker — recommended)

```bash
cd backend
docker compose up --build
```

- API:      http://localhost:8000
- Swagger:  http://localhost:8000/docs
- ReDoc:    http://localhost:8000/redoc

The database is seeded with sample categories and blogs on first boot.

## Run locally (without Docker)

You need a running PostgreSQL. Then:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# point at your DB (default: postgresql+psycopg://blog:blog@localhost:5432/blog)
cp .env.example .env

python -m app.seed          # optional: load sample data
uvicorn app.main:app --reload
```

> Tip: to spin up just Postgres via Docker, run `docker compose up db`.

---

## API reference

Base path: `/api`

### Categories

| Method | Path                          | Description                       |
|--------|-------------------------------|-----------------------------------|
| GET    | `/api/categories`             | List categories                   |
| POST   | `/api/categories`             | Create a category                 |
| GET    | `/api/categories/{id}`        | Get one category                  |
| PUT    | `/api/categories/{id}`        | Update a category                 |
| DELETE | `/api/categories/{id}`        | Delete a category                 |
| GET    | `/api/categories/{id}/blogs`  | List blogs in a category          |

### Blogs

| Method | Path                | Description                                    |
|--------|---------------------|------------------------------------------------|
| GET    | `/api/blogs`        | List blogs                                     |
| POST   | `/api/blogs`        | Create a blog                                  |
| GET    | `/api/blogs/{id}`   | Get one blog (includes its category)           |
| PUT    | `/api/blogs/{id}`   | Update a blog                                  |
| DELETE | `/api/blogs/{id}`   | Delete a blog                                  |

**Query params on `GET /api/blogs`:**
`skip`, `limit`, `category_id`, `published` (true/false), `search` (title match).

### Examples

```bash
# List blogs in category 1
curl "http://localhost:8000/api/blogs?category_id=1"

# Create a category
curl -X POST http://localhost:8000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Lifestyle", "description": "Daily life"}'

# Create a blog
curl -X POST http://localhost:8000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Post", "content": "Hello world", "category_id": 1}'
```

`slug` is auto-generated from `title`/`name` when omitted, and made unique.

---

## Data models

**Category:** `id`, `name`, `slug`, `description`, `created_at`
**Blog:** `id`, `title`, `slug`, `content`, `published`, `category_id`, `created_at`, `updated_at`

Deleting a category sets its blogs' `category_id` to `null` (posts are kept).
