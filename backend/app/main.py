from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import crud
from .config import settings
from .database import Base, SessionLocal, engine
from .routers import auth, authors, blogs, categories, uploads


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup. For a practice project this is simpler than
    # wiring up migrations; swap for Alembic if the schema starts to evolve.
    Base.metadata.create_all(bind=engine)

    # Seed the single admin user from env if it doesn't exist yet, so there's
    # always a login for the dashboard. Idempotent across restarts.
    db = SessionLocal()
    try:
        if crud.get_user_by_username(db, settings.admin_username) is None:
            crud.create_user(db, settings.admin_username, settings.admin_password)
    finally:
        db.close()

    yield


app = FastAPI(
    title="Blog / CMS API",
    description=(
        "A simple blog & category API for frontend practice. Reads are public; "
        "writes require a Bearer token from POST /api/auth/login."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Expose the pagination total so browsers (the admin dashboard) can read it.
    expose_headers=["X-Total-Count"],
)

# Serve uploaded media from the configured directory under /static/uploads.
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.mount(
    "/static/uploads",
    StaticFiles(directory=settings.upload_dir),
    name="uploads",
)

app.include_router(auth.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(authors.router, prefix="/api")
app.include_router(blogs.router, prefix="/api")
app.include_router(uploads.router, prefix="/api")


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "docs": "/docs"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}
