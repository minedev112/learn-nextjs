from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/categories", tags=["categories"])


def _get_or_404(db: Session, category_id: int):
    category = crud.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@router.get("", response_model=list[schemas.CategoryOut])
def list_categories(
    response: Response,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    categories = crud.list_categories(db, skip=skip, limit=limit)
    counts = crud.post_counts_by_category(db)
    for category in categories:
        category.post_count = counts.get(category.id, 0)
    response.headers["X-Total-Count"] = str(crud.count_categories(db))
    return categories


@router.post("", response_model=schemas.CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(data: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, data)


@router.get("/{category_id}", response_model=schemas.CategoryOut)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = _get_or_404(db, category_id)
    category.post_count = crud.count_category_blogs(db, category_id)
    return category


@router.get("/{category_id}/blogs", response_model=list[schemas.BlogOut])
def list_category_blogs(
    category_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    published: bool | None = None,
    db: Session = Depends(get_db),
):
    _get_or_404(db, category_id)
    return crud.list_blogs(db, skip=skip, limit=limit, category_id=category_id, published=published)


@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(
    category_id: int, data: schemas.CategoryUpdate, db: Session = Depends(get_db)
):
    category = _get_or_404(db, category_id)
    category = crud.update_category(db, category, data)
    category.post_count = crud.count_category_blogs(db, category_id)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = _get_or_404(db, category_id)
    crud.delete_category(db, category)
