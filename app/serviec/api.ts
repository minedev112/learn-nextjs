import { Blog } from "@/typess/blog";
import { Author } from "@/typess/author";
const BASE_URL = "https://demo-blog.minebox.space/api";

export async function getBlogs(limit?: number): Promise<Blog[]> {
  const url = limit
    ? `${BASE_URL}/blogs?limit=${limit}`
    : `${BASE_URL}/blogs`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Cannot fetch blogs");
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
