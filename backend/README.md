# Blog / CMS API

A simple FastAPI backend for a blog / CMS, built for frontend interns to practice
API integration. **No authentication** — every endpoint is open.

## Features

- Blogs, Categories and Authors with full CRUD
- Blogs carry cover image, excerpt (auto-derived), author and computed read-time
- List & filter blogs (by category, author, published state, title search) with pagination
- List responses expose the total via an `X-Total-Count` header
- Authors & categories report a `post_count`; `GET /api/blogs` embeds each blog's category & author
- Image upload endpoint for cover images / avatars
- List blogs within a category or by an author
- Auto-generated URL slugs
- PostgreSQL storage/ Hellos
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

### Authors

| Method | Path                       | Description                    |
|--------|----------------------------|--------------------------------|
| GET    | `/api/authors`             | List authors                   |
| POST   | `/api/authors`             | Create an author               |
| GET    | `/api/authors/{id}`        | Get one author                 |
| PUT    | `/api/authors/{id}`        | Update an author               |
| DELETE | `/api/authors/{id}`        | Delete an author               |
| GET    | `/api/authors/{id}/blogs`  | List blogs by an author        |

### Blogs

| Method | Path                | Description                                       |
|--------|---------------------|---------------------------------------------------|
| GET    | `/api/blogs`        | List blogs (embeds category & author; total in `X-Total-Count`) |
| POST   | `/api/blogs`        | Create a blog                                     |
| GET    | `/api/blogs/{id}`   | Get one blog (includes its category & author)     |
| PUT    | `/api/blogs/{id}`   | Update a blog                                     |
| DELETE | `/api/blogs/{id}`   | Delete a blog                                     |

**Query params on `GET /api/blogs`:**
`skip`, `limit`, `category_id`, `author_id`, `published` (true/false), `search` (title match).

All three list endpoints (`/api/blogs`, `/api/authors`, `/api/categories`) return the total
number of matching rows in an **`X-Total-Count`** response header (respecting any filters), for
building pagination.

### Media

| Method | Path            | Description                                        |
|--------|-----------------|----------------------------------------------------|
| POST   | `/api/uploads`  | Upload an image (multipart `file`); returns a URL  |

Accepts JPEG/PNG/WebP/GIF up to 5 MB. Files are stored in `UPLOAD_DIR` and served at
`/static/uploads/<name>`; the response is `{"url": "...", "filename": "..."}`. Use the returned
`url` as a blog `cover_image` or an author `avatar_url`.

> Uploads are written to local disk — fine for development, but they won't persist across
> container redeploys. For production, point the upload step at object storage (S3/R2); the
> endpoint's response contract stays the same.

### Examples

```bash
# List blogs in category 1
curl "http://localhost:8000/api/blogs?category_id=1"

# Create a category
curl -X POST http://localhost:8000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Lifestyle", "description": "Daily life"}'

# Create a blog (with cover image, author and category)
curl -X POST http://localhost:8000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Post", "content": "Hello world",
       "cover_image": "https://picsum.photos/1200/600",
       "category_id": 1, "author_id": 1}'
```

`slug` is auto-generated from `title`/`name` when omitted, and made unique.
`excerpt` is derived from `content` when omitted. `read_time_minutes` is
computed from the content (~200 words/min) and returned on every blog.

---

## Data models

**Category:** `id`, `name`, `slug`, `description`, `created_at`, `post_count` (computed)
**Author:** `id`, `name`, `avatar_url`, `bio`, `created_at`, `post_count` (computed)
**Blog:** `id`, `title`, `slug`, `excerpt`, `content`, `cover_image`, `published`,
`category_id`, `author_id`, `read_time_minutes` (computed), `created_at`, `updated_at`.
`GET /api/blogs/{id}` (and create/update responses) also embed the full `category`
and `author` objects.

Deleting a category or author sets the affected blogs' `category_id` / `author_id`
to `null` (posts are kept).
