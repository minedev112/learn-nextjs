import Image from "next/image";
import { Button } from "@/components/ui/button";
import Hero from "../../components/BlogComponent/hero";
import SearchBar from "../../components/BlogComponent/searchbar";
import { getBlogs, getAuthors, getCategories, getBlogsId } from "@/services/api";
import BlogCard from "../../components/BlogComponent/BlogCard";
import { PaginationDemo } from "../../components/BlogComponent/pagination";
import { Author } from "@/typess/author";
import { Blog } from "@/typess/blog";


//trang chủ blog

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}) {
  const { page, search } = await searchParams;

  const currentPage = Number(page) || 1;
  const limit = 2;
  const skip = (currentPage - 1) * limit;

  const [blogs, authors, categories] = await Promise.all([
    getBlogs(search ?? "", skip, limit),
    getAuthors(),
    getCategories(),
  ]);

  return (
    <>
      <Hero />

      <SearchBar />

      <section className="max-w-6xl mx-auto mt-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {blogs.map((blog) => {
          const author = authors.find(
            (a) => a.id === blog.author_id
          );

          const category = categories.find(
            (c) => c.id === blog.category_id
          );

          return (
            <BlogCard
              key={blog.id}
              blog={blog}
              author={author}
              categories={category}
            />
          );
        })}
      </section>

      <PaginationDemo />
    </>
  );
}