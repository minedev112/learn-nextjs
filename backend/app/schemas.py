import math
import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, computed_field


# ---------- Auth ----------
class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    created_at: datetime


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
    post_count: int = 0


# ---------- Author ----------
class AuthorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    avatar_url: str | None = Field(None, max_length=500)
    bio: str | None = None


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=120)
    avatar_url: str | None = Field(None, max_length=500)
    bio: str | None = None


class AuthorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    avatar_url: str | None
    bio: str | None
    created_at: datetime
    post_count: int = 0


# ---------- Blog ----------
class BlogBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    slug: str | None = Field(None, max_length=220, description="Auto-generated from title if omitted")
    excerpt: str | None = Field(None, description="Short summary; derived from content if omitted")
    content: str = ""
    cover_image: str | None = Field(None, max_length=500)
    published: bool = True
    category_id: int | None = None
    author_id: int | None = None


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    slug: str | None = Field(None, max_length=220)
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = Field(None, max_length=500)
    published: bool | None = None
    category_id: int | None = None
    author_id: int | None = None


class BlogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str
    excerpt: str | None
    content: str
    cover_image: str | None
    published: bool
    category_id: int | None
    author_id: int | None
    created_at: datetime
    updated_at: datetime

    @computed_field  # read-time estimate at ~200 words/min, shown as "N min read"
    @property
    def read_time_minutes(self) -> int:
        words = len(re.findall(r"\w+", self.content or ""))
        return max(1, math.ceil(words / 200))


class BlogWithRelations(BlogOut):
    category: CategoryOut | None = None
    author: AuthorOut | None = None
