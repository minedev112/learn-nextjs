from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/authors", tags=["authors"])


def _get_or_404(db: Session, author_id: int):
    author = crud.get_author(db, author_id)
    if author is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")
    return author


@router.get("", response_model=list[schemas.AuthorOut])
def list_authors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return crud.list_authors(db, skip=skip, limit=limit)


@router.post("", response_model=schemas.AuthorOut, status_code=status.HTTP_201_CREATED)
def create_author(data: schemas.AuthorCreate, db: Session = Depends(get_db)):
    return crud.create_author(db, data)


@router.get("/{author_id}", response_model=schemas.AuthorOut)
def get_author(author_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, author_id)


@router.get("/{author_id}/blogs", response_model=list[schemas.BlogOut])
def list_author_blogs(
    author_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    published: bool | None = None,
    db: Session = Depends(get_db),
):
    _get_or_404(db, author_id)
    return crud.list_blogs(db, skip=skip, limit=limit, author_id=author_id, published=published)


@router.put("/{author_id}", response_model=schemas.AuthorOut)
def update_author(author_id: int, data: schemas.AuthorUpdate, db: Session = Depends(get_db)):
    author = _get_or_404(db, author_id)
    return crud.update_author(db, author, data)


@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_author(author_id: int, db: Session = Depends(get_db)):
    author = _get_or_404(db, author_id)
    crud.delete_author(db, author)
