"""Idempotent, NON-destructive schema sync run at container start.

`Base.metadata.create_all` creates missing *tables* but never alters existing
ones, so when we add a column to an already-deployed table it won't appear.
This module fills that gap for the few columns this project has added, without
dropping anything. It is safe to run on every boot and never touches data.

For a bigger project you'd reach for Alembic instead; this is deliberately
minimal for a practice app.

Usage:  python -m app.dbinit
"""
from sqlalchemy import inspect, text

from . import models  # noqa: F401 -- ensure models register on Base
from .database import Base, engine

# Columns added to `blogs` after its first deploy -> (name, column DDL).
_BLOG_COLUMNS = {
    "excerpt": "TEXT",
    "cover_image": "VARCHAR(500)",
    "author_id": "INTEGER",
}


def run() -> None:
    # 1. Create any missing tables (e.g. the new `authors` table).
    Base.metadata.create_all(bind=engine)

    # 2. Add any missing columns to an already-existing `blogs` table.
    inspector = inspect(engine)
    existing = {c["name"] for c in inspector.get_columns("blogs")}
    added = []
    with engine.begin() as conn:
        for name, ddl in _BLOG_COLUMNS.items():
            if name not in existing:
                conn.execute(text(f"ALTER TABLE blogs ADD COLUMN {name} {ddl}"))
                added.append(name)

    print(f"Schema ensured. Added columns: {added or 'none'}")


if __name__ == "__main__":
    run()
