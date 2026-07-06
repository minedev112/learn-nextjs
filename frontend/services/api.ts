import { Author } from "@/typess/author";
import { Blog } from "@/typess/blog";
import { category } from "@/typess/categories";

const BASE_URL = "https://demo-blog.minebox.space/api";

export async function getBlogs(limit = 2): Promise<Blog[]> {
  const res = await fetch(
    `${BASE_URL}/blogs?limit=${limit}`,
    {
      cache: "no-store",  
    }
  );

  if (!res.ok) {
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