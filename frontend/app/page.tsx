import Image from "next/image";
import { Button } from "@/components/ui/button";
import Hero from "./components2/hero";
import SearchBar from "./components2/searchbar";
import { getBlogs, getAuthors } from "@/services/api";
import BlogCard from "./components2/BlogCard";
import  {PaginationDemo}  from "./components2/pagination";
import { Author } from "@/typess/author";






export default async function Home() {
  const [blogs, authors] = await Promise.all([
  getBlogs(2),
  getAuthors(),
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

  return (
    <BlogCard
      key={blog.id}
      blog={blog}
      author={author}
    />
  );
})}


    
    
            </section>
            
            <PaginationDemo />

           

          
        </>
  );
}