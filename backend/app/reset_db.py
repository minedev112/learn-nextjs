"""Drop and recreate all tables. DESTRUCTIVE — wipes all data.

Handy in local dev (or a fresh demo) after a schema change when you want a
clean slate. It is NOT run automatically anywhere.

Usage:  python -m app.reset_db
"""
from . import models  # noqa: F401 -- ensure models register on Base
from .database import Base, engine


def run() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Dropped and recreated all tables.")


if __name__ == "__main__":
    run()
