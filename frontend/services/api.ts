import { Author } from "@/typess/author";
import { Blog } from "@/typess/blog";

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
