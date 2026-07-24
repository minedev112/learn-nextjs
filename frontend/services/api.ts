import { Author } from "@/typess/author";
import { Blog } from "@/typess/blog";
import { category } from "@/typess/categories";

import { apiFetch } from "@/lib/api";
const BASE_URL = "https://demo-blog.minebox.space/api";

export async function getBlogs(
  search = "",
  skip = 0,
  limit = 6
): Promise<Blog[]> {
  const url = `${BASE_URL}/blogs?search=${search}&skip=${skip}&limit=${limit}`;

  console.log("Fetching:", url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  console.log("Status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("Response:", text);

    throw new Error("Không thể lấy dữ liệu");
  }

  return res.json();
}


export async function getAuthors(): Promise<Author[]> {
  const res = await fetch(`${BASE_URL}/authors`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Cannot fetch authors");
  }

  return res.json();
}

export async function getCategories(): Promise<category[]> {
  const res = await fetch(`${BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Cannot fetch categories");
  }

  return res.json();
}



export async function getBlogsId(id: number): Promise<Blog> {
  const url = `${BASE_URL}/blogs/${id}`;

  console.log("Fetching:", url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  console.log("Status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("Response:", text);

    throw new Error("Không thể lấy dữ liệu");
  }

  return res.json();
}
/// api dashboard
//create, update, delete blog

export async function createBlog(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  category_id: number;
  author_id: number;
}) {
const res = await apiFetch("/blogs", {
  method: "POST",
  body: JSON.stringify(data),
});

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}

export async function updateBlog(
  id: number,
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    published: boolean;
    category_id: number;
    author_id: number;
  }
) {
 const res = await apiFetch(`/blogs/${id}`, {
  method: "PUT",
  body: JSON.stringify(data),
});

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}


export async function deleteBlog(id: number) {
 const res = await apiFetch(`/blogs/${id}`, {
  method: "DELETE",
});

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return true;
}


// =========================
// AUTHOR API
// =========================

export async function createAuthor(data: {
  name: string;
  avatar_url: string;
  bio: string;
}) {
 const res = await apiFetch("/authors", {
  method: "POST",
  body: JSON.stringify(data),
});

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function updateAuthor(
  id: number,
  data: {
    name: string;
    avatar_url: string;
    bio: string;
  }
) {
  const res = await apiFetch(`/authors/${id}`, {
  method: "PUT",
  body: JSON.stringify(data),
});

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function deleteAuthor(id: number) {
  const res = await apiFetch(`/authors/${id}`, {
  method: "DELETE",
});
  if (!res.ok) {
    throw new Error(await res.text());
  }

  return true;
}

//category api
///
///
export async function createCategory(data: {
  name: string;
  slug: string;
  description: string;
}) {
const res = await apiFetch("/categories", {
  method: "POST",
  body: JSON.stringify(data),
});

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}

export async function updateCategory(
  id: number,
  data: {
    name: string;
    slug: string;
    description: string;
  }
) 
{
  const res = await apiFetch(`/categories/${id}`, {
  method: "PUT",
  body: JSON.stringify(data),
});

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}


export async function deleteCategory(id: number) {
 const res = await apiFetch(`/categories/${id}`, {
  method: "DELETE",
});
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return true;
}

//auth dashboard
export async function login(data: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}

export async function getCurrentUser() {
  const res = await apiFetch("/auth/me", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Cannot fetch current user");
  }

  return res.json();
}