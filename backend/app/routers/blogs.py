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


@router.get("", response_model=list[schemas.BlogOut])
def list_blogs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    category_id: int | None = None,
    published: bool | None = None,
    search: str | None = Query(None, description="Filter by title (case-insensitive)"),
    db: Session = Depends(get_db),
):
    return crud.list_blogs(
        db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        published=published,
        search=search,
    )


@router.post("", response_model=schemas.BlogWithCategory, status_code=status.HTTP_201_CREATED)
def create_blog(data: schemas.BlogCreate, db: Session = Depends(get_db)):
    if data.category_id is not None and crud.get_category(db, data.category_id) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found")
    return crud.create_blog(db, data)


@router.get("/{blog_id}", response_model=schemas.BlogWithCategory)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, blog_id)


@router.put("/{blog_id}", response_model=schemas.BlogWithCategory)
def update_blog(blog_id: int, data: schemas.BlogUpdate, db: Session = Depends(get_db)):
    blog = _get_or_404(db, blog_id)
    if data.category_id is not None and crud.get_category(db, data.category_id) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found")
    return crud.update_blog(db, blog, data)


@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = _get_or_404(db, blog_id)
    crud.delete_blog(db, blog)
