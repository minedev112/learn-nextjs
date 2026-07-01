from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/blogs", tags=["blogs"])


def _get_or_404(db: Session, blog_id: int):
    blog = crud.get_blog(db, blog_id)
    if blog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    return blog


def _validate_relations(db: Session, category_id: int | None, author_id: int | None):
    if category_id is not None and crud.get_category(db, category_id) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found")
    if author_id is not None and crud.get_author(db, author_id) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Author not found")


@router.get("", response_model=list[schemas.BlogOut])
def list_blogs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    category_id: int | None = None,
    author_id: int | None = None,
    published: bool | None = None,
    search: str | None = Query(None, description="Filter by title (case-insensitive)"),
    db: Session = Depends(get_db),
):
    return crud.list_blogs(
        db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        author_id=author_id,
        published=published,
        search=search,
    )


@router.post("", response_model=schemas.BlogWithRelations, status_code=status.HTTP_201_CREATED)
def create_blog(data: schemas.BlogCreate, db: Session = Depends(get_db)):
    _validate_relations(db, data.category_id, data.author_id)
    return crud.create_blog(db, data)


@router.get("/{blog_id}", response_model=schemas.BlogWithRelations)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, blog_id)


@router.put("/{blog_id}", response_model=schemas.BlogWithRelations)
def update_blog(blog_id: int, data: schemas.BlogUpdate, db: Session = Depends(get_db)):
    blog = _get_or_404(db, blog_id)
    _validate_relations(db, data.category_id, data.author_id)
    return crud.update_blog(db, blog, data)


@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = _get_or_404(db, blog_id)
    crud.delete_blog(db, blog)
