import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/typess/blog";
import { Author } from "@/typess/author";
import { category  } from "@/typess/categories";

interface Props {
  blog: Blog;
  author?: Author;
  categories?: category;
}

export default function BlogCard({ blog, author, categories }: Props) {
  return (
    
        <Link
          href={`/blogs/${blog.id}`} className="block">
      
    <div className="space-y-4">
      <Image
        src={blog.cover_image}
        alt={blog.title}
        width={600}
        height={400}
        className="w-full h-60 object-cover rounded-lg"
      />

      <div>
              <p className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded">
              {categories?.name}
                  </p>
       
        <p className="text-sm text-gray-500">
          {blog.read_time_minutes} min read
        </p>

        <h2 className="text-2xl font-bold mt-2">
          {blog.title}
        </h2>

        <p className="text-gray-600 mt-3">
          {blog.excerpt}
        </p>

         
       <div className="flex items-center gap-3 mt-5">
  <Image
    src={author?.avatar_url || "/avatar-placeholder.png"}
    alt={author?.name || "Author"}
    width={40}
    height={40}
    className="rounded-full"
  />

  <div>
    <p className="font-medium">{author?.name}</p>
    <p className="text-sm text-gray-500">
      {new Date(blog.created_at).toLocaleDateString()}
    </p>
  </div>
</div>
        
      </div>
    </div>
    </Link>
  );
}