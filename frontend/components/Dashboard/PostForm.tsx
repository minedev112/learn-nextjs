"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Author } from "@/typess/author";
import { category } from "@/typess/categories";
import { useState,useEffect } from "react";
import { createBlog,updateBlog} from "@/services/api";
import { useRouter } from "next/navigation";
import { Blog } from "@/typess/blog";
interface PostFormProps {
    authors: Author[];
    categories: category[];
     initialData?: Blog;

     mode: "create" | "edit";
}

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

export default function PostForm({
    authors,
    categories,
    initialData,
    mode,
}: PostFormProps) {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");

    const [categoryId, setCategoryId] = useState(0);
    const [authorId, setAuthorId] = useState(0);

    const [published, setPublished] = useState(true);

    useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title);
    setSlug(initialData.slug);
    setExcerpt(initialData.excerpt);
    setContent(initialData.content);
    setCoverImage(initialData.cover_image);
    setCategoryId(initialData.category_id);
    setAuthorId(initialData.author_id);
    setPublished(initialData.published);
}, [initialData]);

const router = useRouter();
const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    const blogData = {
      title,
      slug,
      excerpt,
      content,
      cover_image: coverImage || "/images/default-blog.jpg",
      published,
      category_id: categoryId,
      author_id: authorId,
    };

    if (mode === "create") {
      await createBlog(blogData);
    } else {
      await updateBlog(initialData!.id, blogData);
    }

    alert(
      mode === "create"
        ? "Post created successfully!"
        : "Post updated successfully!"
    );

    router.push("/dashboard/posts");
  } catch (error) {
    console.error(error);
    alert("Có lỗi xảy ra!");
  }
};


    return (
        <form className="space-y-6  " onSubmit={handleSubmit}>

            <div>
                <label className="block mb-2 font-medium">
                    Title
                </label>

                <Input
                value={title}
                onChange={(e) => {
                    const value = e.target.value;
                    setTitle(value);
                    setSlug(generateSlug(value));
    }}
/>
            </div>

            <div>
                <label className="block mb-2 font-medium">
                    Slug
                </label>

                <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Enter slug"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">
                    Excerpt
                </label>

                <Input
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Enter excerpt"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">
                    Cover Image URL
                </label>

                <Input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                />
            </div>


            <div>
                <label className="block mb-2 font-medium">
                    Category
                </label>

                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full border rounded-md p-2"
                >
                    <option value={0}>
                        Select category
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium">
                    Author
                </label>

                <select
                    value={authorId}
                    onChange={(e) => setAuthorId(Number(e.target.value))}
                    className="w-full border rounded-md p-2"
                >
                    <option value={0}>
                        Select author
                    </option>

                    {authors.map((author) => (
                        <option
                            key={author.id}
                            value={author.id}
                        >
                            {author.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                />

                <label>
                    Published
                </label>
            </div>

            <div>
                <label className="block mb-2 font-medium">
                    Content
                </label>

                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                />
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="outline" type="submit">
                     {mode === "create" ? "Create Post" : "Update Post"}
                </Button>
<Button
    type="button"
    variant="outline"
    onClick={() => router.push("/dashboard/posts")}
>
    Cancel
</Button>
            </div>

        </form>
    );
}