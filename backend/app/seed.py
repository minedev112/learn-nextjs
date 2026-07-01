"""Populate the database with a few categories and blog posts.

Run standalone with:  python -m app.seed
Idempotent: it only seeds when the categories table is empty.
"""
from sqlalchemy import select

from .database import Base, SessionLocal, engine
from . import models


CATEGORIES = [
    {"name": "Technology", "slug": "technology", "description": "Programming, gadgets and the web."},
    {"name": "Travel", "slug": "travel", "description": "Destinations and travel tips."},
    {"name": "Food", "slug": "food", "description": "Recipes and restaurant reviews."},
]

BLOGS = [
    {
        "title": "Getting Started with FastAPI",
        "content": "FastAPI makes building APIs fast and fun. Here is how to begin...",
        "category": "technology",
    },
    {
        "title": "Why TypeScript on the Frontend",
        "content": "Type safety catches bugs before they reach production...",
        "category": "technology",
    },
    {
        "title": "A Weekend in Da Nang",
        "content": "Beaches, bridges and great street food await in central Vietnam...",
        "category": "travel",
    },
    {
        "title": "The Perfect Bowl of Pho",
        "content": "A rich broth simmered for hours is the heart of this dish...",
        "category": "food",
    },
]


def run() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(models.Category)) is not None:
            print("Database already seeded, skipping.")
            return

        from .utils import slugify

        cats: dict[str, models.Category] = {}
        for c in CATEGORIES:
            category = models.Category(**c)
            db.add(category)
            cats[c["slug"]] = category
        db.flush()

        for b in BLOGS:
            db.add(
                models.Blog(
                    title=b["title"],
                    slug=slugify(b["title"]),
                    content=b["content"],
                    published=True,
                    category_id=cats[b["category"]].id,
                )
            )
        db.commit()
        print(f"Seeded {len(CATEGORIES)} categories and {len(BLOGS)} blogs.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
