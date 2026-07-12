import { Author } from "@/typess/author";
import { Blog } from "@/typess/blog";
import { category } from "@/typess/categories";

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
  const res = await fetch(`${BASE_URL}/blogs`, {
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
  const res = await fetch(`${BASE_URL}/blogs/${id}`, {
    method: "PUT",
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


export async function deleteBlog(id: number) {
  const res = await fetch(`${BASE_URL}/blogs/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return true;
}




