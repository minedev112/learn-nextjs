from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    slug: str | None = Field(None, max_length=140, description="Auto-generated from name if omitted")
    description: str | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=120)
    slug: str | None = Field(None, max_length=140)
    description: str | None = None


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str | None
    created_at: datetime


# ---------- Blog ----------
class BlogBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    slug: str | None = Field(None, max_length=220, description="Auto-generated from title if omitted")
    content: str = ""
    published: bool = True
    category_id: int | None = None


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    slug: str | None = Field(None, max_length=220)
    content: str | None = None
    published: bool | None = None
    category_id: int | None = None


class BlogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str
    content: str
    published: bool
    category_id: int | None
    created_at: datetime
    updated_at: datetime


class BlogWithCategory(BlogOut):
    category: CategoryOut | None = None
