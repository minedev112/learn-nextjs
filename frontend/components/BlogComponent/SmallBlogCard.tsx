import { Blog,  } from "@/typess/blog";
import Image from "next/image";
import Link from "next/link";

interface Props {
  blog: Blog;
}

export default function SmallBlogCard({ blog }: Props) {
  return (
    
        <Link
  href={`/blogs/${blog.id}`}
  className="flex gap-4 hover:opacity-80 transition"
>
      
    <div className="flex gap-4">
      <Image
        src={blog.cover_image}
        alt={blog.title}
        width={180}
        height={120}
        className="w-44 h-28 object-cover rounded-lg flex-shrink-0"
        />

     <div className="space-y-2">
             
       
        

        <h2 className="text-lg font-semibold">
          {blog.title}
        </h2>

        <p className="text-gray-600 mt-3">
          {blog.excerpt}
        </p>

         
      
        
      </div>
    </div>
    </Link>
  );
}