from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from . import models, schemas
from .utils import slugify


def _unique_slug(db: Session, model, base: str, exclude_id: int | None = None) -> str:
    """Return a slug based on `base` that is unique for the given model."""
    slug = slugify(base)
    candidate = slug
    i = 2
    while True:
        stmt = select(model).where(model.slug == candidate)
        if exclude_id is not None:
            stmt = stmt.where(model.id != exclude_id)
        if db.scalar(stmt) is None:
            return candidate
        candidate = f"{slug}-{i}"
        i += 1


def _derive_excerpt(content: str, limit: int = 160) -> str | None:
    """Build a short excerpt from the start of the content."""
    text = " ".join((content or "").split())
    if not text:
        return None
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0] + "…"


# ---------- Category ----------
def list_categories(db: Session, skip: int = 0, limit: int = 100) -> list[models.Category]:
    stmt = select(models.Category).order_by(models.Category.id).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


def count_categories(db: Session) -> int:
    return db.scalar(select(func.count(models.Category.id))) or 0


def post_counts_by_category(db: Session) -> dict[int, int]:
    rows = db.execute(
        select(models.Blog.category_id, func.count(models.Blog.id)).group_by(
            models.Blog.category_id
        )
    ).all()
    return {cid: count for cid, count in rows if cid is not None}


def count_category_blogs(db: Session, category_id: int) -> int:
    return (
        db.scalar(
            select(func.count(models.Blog.id)).where(
                models.Blog.category_id == category_id
            )
        )
        or 0
    )


def get_category(db: Session, category_id: int) -> models.Category | None:
    return db.get(models.Category, category_id)


def get_category_by_slug(db: Session, slug: str) -> models.Category | None:
    return db.scalar(select(models.Category).where(models.Category.slug == slug))


def create_category(db: Session, data: schemas.CategoryCreate) -> models.Category:
    category = models.Category(
        name=data.name,
        slug=_unique_slug(db, models.Category, data.slug or data.name),
        description=data.description,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(
    db: Session, category: models.Category, data: schemas.CategoryUpdate
) -> models.Category:
    payload = data.model_dump(exclude_unset=True)
    if "slug" in payload and payload["slug"]:
        payload["slug"] = _unique_slug(db, models.Category, payload["slug"], exclude_id=category.id)
    for key, value in payload.items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: models.Category) -> None:
    db.delete(category)
    db.commit()


# ---------- Author ----------
def list_authors(db: Session, skip: int = 0, limit: int = 100) -> list[models.Author]:
    stmt = select(models.Author).order_by(models.Author.id).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


def count_authors(db: Session) -> int:
    return db.scalar(select(func.count(models.Author.id))) or 0


def post_counts_by_author(db: Session) -> dict[int, int]:
    rows = db.execute(
        select(models.Blog.author_id, func.count(models.Blog.id)).group_by(
            models.Blog.author_id
        )
    ).all()
    return {aid: count for aid, count in rows if aid is not None}


def count_author_blogs(db: Session, author_id: int) -> int:
    return (
        db.scalar(
            select(func.count(models.Blog.id)).where(
                models.Blog.author_id == author_id
            )
        )
        or 0
    )


def get_author(db: Session, author_id: int) -> models.Author | None:
    return db.get(models.Author, author_id)


def create_author(db: Session, data: schemas.AuthorCreate) -> models.Author:
    author = models.Author(name=data.name, avatar_url=data.avatar_url, bio=data.bio)
    db.add(author)
    db.commit()
    db.refresh(author)
    return author


def update_author(db: Session, author: models.Author, data: schemas.AuthorUpdate) -> models.Author:
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(author, key, value)
    db.commit()
    db.refresh(author)
    return author


def delete_author(db: Session, author: models.Author) -> None:
    db.delete(author)
    db.commit()


# ---------- Blog ----------
def _apply_blog_filters(stmt, category_id, author_id, published, search):
    if category_id is not None:
        stmt = stmt.where(models.Blog.category_id == category_id)
    if author_id is not None:
        stmt = stmt.where(models.Blog.author_id == author_id)
    if published is not None:
        stmt = stmt.where(models.Blog.published == published)
    if search:
        stmt = stmt.where(models.Blog.title.ilike(f"%{search}%"))
    return stmt


def list_blogs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category_id: int | None = None,
    author_id: int | None = None,
    published: bool | None = None,
    search: str | None = None,
) -> list[models.Blog]:
    stmt = _apply_blog_filters(
        select(models.Blog), category_id, author_id, published, search
    )
    # Eager-load relations so list responses can embed category/author without N+1.
    stmt = (
        stmt.options(
            selectinload(models.Blog.category), selectinload(models.Blog.author)
        )
        .order_by(models.Blog.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt).all())


def count_blogs(
    db: Session,
    category_id: int | None = None,
    author_id: int | None = None,
    published: bool | None = None,
    search: str | None = None,
) -> int:
    stmt = _apply_blog_filters(
        select(func.count(models.Blog.id)), category_id, author_id, published, search
    )
    return db.scalar(stmt) or 0


def get_blog(db: Session, blog_id: int) -> models.Blog | None:
    return db.get(models.Blog, blog_id)


def get_blog_by_slug(db: Session, slug: str) -> models.Blog | None:
    return db.scalar(select(models.Blog).where(models.Blog.slug == slug))


def create_blog(db: Session, data: schemas.BlogCreate) -> models.Blog:
    blog = models.Blog(
        title=data.title,
        slug=_unique_slug(db, models.Blog, data.slug or data.title),
        excerpt=data.excerpt or _derive_excerpt(data.content),
        content=data.content,
        cover_image=data.cover_image,
        published=data.published,
        category_id=data.category_id,
        author_id=data.author_id,
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog


def update_blog(db: Session, blog: models.Blog, data: schemas.BlogUpdate) -> models.Blog:
    payload = data.model_dump(exclude_unset=True)
    if "slug" in payload and payload["slug"]:
        payload["slug"] = _unique_slug(db, models.Blog, payload["slug"], exclude_id=blog.id)
    # If content changes but no excerpt was supplied and none exists, refresh it.
    if "content" in payload and not payload.get("excerpt") and not blog.excerpt:
        payload["excerpt"] = _derive_excerpt(payload["content"])
    for key, value in payload.items():
        setattr(blog, key, value)
    db.commit()
    db.refresh(blog)
    return blog


def delete_blog(db: Session, blog: models.Blog) -> None:
    db.delete(blog)
    db.commit()
