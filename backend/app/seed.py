"""Populate the database with sample authors, categories and blog posts.

Run standalone with:  python -m app.seed
Idempotent: it only seeds when the categories table is empty.

Content mirrors the "Simple NextJs Blog" Figma design so the frontend has
realistic data (cover images, authors, excerpts, categories) to render.
"""
from sqlalchemy import select

from . import models
from .database import Base, SessionLocal, engine
from .utils import slugify

AUTHORS = [
    {
        "key": "george",
        "name": "George Costanza",
        "avatar_url": "https://i.pravatar.cc/150?img=12",
        "bio": "Traveller, home cook and occasional over-thinker. Writes about food, "
        "trips and the small lessons in between.",
    },
    {
        "key": "elaine",
        "name": "Elaine Benes",
        "avatar_url": "https://i.pravatar.cc/150?img=5",
        "bio": "Editor by day, recipe tinkerer by night. Believes every meal is better shared.",
    },
]

CATEGORIES = [
    {"name": "Travel", "slug": "travel", "description": "Destinations, trips and travel tips."},
    {"name": "Recipe", "slug": "recipe", "description": "Recipes and food adventures."},
    {"name": "Lifestyle", "slug": "lifestyle", "description": "Everyday life, habits and ideas."},
]

BLOGS = [
    {
        "title": "What I Learned About Life and Food Backpacking Around Greece",
        "excerpt": "Two weeks, one backpack and a lot of souvlaki — here's what the road taught me.",
        "content": (
            "Backpacking around Greece for two weeks changed how I think about travel, food "
            "and slowing down.\n\nHow to travel without spending a dime — okay, not quite a dime, "
            "but far less than you'd expect once you eat where the locals eat.\n\nGet the most out "
            "of your credit card reward points and you can stretch a small budget a long way.\n\n"
            "Why you don't need more than 3 pieces of clothing when everything you own fits on "
            "your back."
        ),
        "cover_image": "https://picsum.photos/seed/greece-lighthouse/1200/600",
        "category": "travel",
        "author": "george",
    },
    {
        "title": "What Traveling Greece For 2 Weeks Taught Me About Life",
        "excerpt": "The islands have a way of rearranging your priorities.",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. From Navagio beach "
        "to hidden tavernas, two weeks on the road left me with more than photos.",
        "cover_image": "https://picsum.photos/seed/navagio-beach/1200/600",
        "category": "travel",
        "author": "george",
    },
    {
        "title": "Why You Should Never Order 12 Chicken Nuggets and Fries",
        "excerpt": "A cautionary (and delicious) tale about portion sizes.",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sometimes the smart "
        "order is the smaller one — here's the maths behind the nuggets.",
        "cover_image": "https://picsum.photos/seed/nuggets-fries/1200/600",
        "category": "recipe",
        "author": "elaine",
    },
    {
        "title": "Why You Don't Need More Than 3 Pieces of Clothing",
        "excerpt": "An easy, comfortable and low-cost approach to packing light.",
        "content": "An easy, comfortable and inexpensive approach to travel wardrobes. Pack less, "
        "worry less, and spend more time actually exploring.",
        "cover_image": "https://picsum.photos/seed/packing-light/1200/600",
        "category": "lifestyle",
        "author": "george",
    },
    {
        "title": "Why You Should Cook With Your Family Together Everyday",
        "excerpt": "The best conversations happen around a chopping board.",
        "content": "Nurture what you love. Cooking together turns an everyday chore into the best "
        "part of the day — and dinner tastes better for it.",
        "cover_image": "https://picsum.photos/seed/family-cooking/1200/600",
        "category": "recipe",
        "author": "elaine",
    },
]


def run() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(models.Category)) is not None:
            print("Database already seeded, skipping.")
            return

        authors: dict[str, models.Author] = {}
        for a in AUTHORS:
            author = models.Author(name=a["name"], avatar_url=a["avatar_url"], bio=a["bio"])
            db.add(author)
            authors[a["key"]] = author

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
                    excerpt=b["excerpt"],
                    content=b["content"],
                    cover_image=b["cover_image"],
                    published=True,
                    category_id=cats[b["category"]].id,
                    author_id=authors[b["author"]].id,
                )
            )
        db.commit()
        print(
            f"Seeded {len(AUTHORS)} authors, {len(CATEGORIES)} categories "
            f"and {len(BLOGS)} blogs."
        )
    finally:
        db.close()


if __name__ == "__main__":
    run()
