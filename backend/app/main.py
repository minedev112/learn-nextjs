from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import Base, engine
from .routers import authors, blogs, categories, uploads


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup. For a practice project this is simpler than
    # wiring up migrations; swap for Alembic if the schema starts to evolve.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Blog / CMS API",
    description="A simple blog & category API for frontend practice. No auth required.",
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
