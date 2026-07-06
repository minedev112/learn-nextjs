import SmallBlogCard from "@/components/BlogComponent/SmallBlogCard";
import { getBlogs, getBlogsId } from "@/services/api";
import Image from "next/image";
export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const blog = await getBlogsId(Number(id));
  const blogs = await getBlogs(3);
  const relatedBlogs = blogs.filter((b) => b.id !== blog.id);

  const paragraphs = blog.content.split("\n\n");

  return (
  <section className="max-w-3xl mx-auto px-6 py-12">
    <p className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded">
      {blog.category.name}
    </p>

   <h1 className="mt-4 text-4xl font-bold leading-tight">
  {blog.title}
</h1>

    <p className="mt-10 text-sm text-gray-500">
  {new Date(blog.created_at).toLocaleDateString()} • {blog.read_time_minutes} min read
</p>

<Image
  src={blog.cover_image}
  alt={blog.title}
  width={1200}
  height={600}
  className="mt-8 w-full rounded-lg object-cover"
/>
<div className="flex items-center gap-3 mt-6">
  <Image
    src={blog.author.avatar_url}
    alt={blog.author.name}
    width={40}
    height={40}
    className="rounded-full"
  />

  <p className="font-medium">
    {blog.author.name}
  </p>
</div>
<div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div>
<div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div>

 <div className="mt-10 space-y-6">
  {paragraphs.map((paragraph, index) => {
    const isHeading =
      paragraph.startsWith("") ||
      paragraph.startsWith("") ||
      paragraph.startsWith("");

    return isHeading ? (
      <h2
        key={index}
        className="text-3xl font-bold mt-10"
      >
        {paragraph}
      </h2>
    ) : (
      <p
        key={index}
        className="text-gray-700 leading-8 text-lg"
      >
        {paragraph}
      </p>
    );
  })}
  </div>






<div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div><div className="mt-8 space-y-6 text-gray-700 leading-8">
  <p>{blog.content}</p>
</div>

    <div className="mt-10 space-y-6">
  {paragraphs.map((paragraph, index) => {
    const isHeading =
      paragraph.startsWith("") ||
      paragraph.startsWith("") ||
      paragraph.startsWith("");

    return isHeading ? (
      <h2
        key={index}
        className="text-3xl font-bold mt-10"
      >
        {paragraph}
      </h2>
    ) : (
      <p
        key={index}
        className="text-gray-700 leading-8 text-lg"
      >
        {paragraph}
      </p>
    );
  })}
  <h2 className="text-3xl font-bold mt-20 mb-8">
     Keep Reading
  </h2>


    
      <div className="space-y-5">
      {relatedBlogs.map((item) => (
        <SmallBlogCard
          key={item.id}
          blog={item}
        />
      ))}
  
       
 <section className="mt-8 border-t pt-2">
  <h2 className="text-2xl font-bold mb-6">
    Written by
  </h2>

  
</section>
<div className="flex items-center gap-4">
    <Image
      src={blog.author.avatar_url}
      alt={blog.author.name}
      width={70}
      height={70}
      className="rounded-full"
    />

    <div>
      <h3 className="text-lg font-semibold">
        {blog.author.name}
      </h3>

      <p className="text-gray-600 mt-1">
        {blog.author.bio}
      </p>
    </div>
  </div>


      </div>
      
</div>
  </section>
);
}