"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Author } from "@/typess/author";
import { category } from "@/typess/categories";
import { useState, useEffect } from "react";
import { createBlog, updateBlog } from "@/services/api";
import { useRouter } from "next/navigation";
import { Blog } from "@/typess/blog";
import Image from "next/image";
import { toast } from "sonner";
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
  const [uploadingImage, setUploadingImage] =
  useState(false);
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


const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setUploadingImage(true);

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Upload image failed"
      );
    }

    setCoverImage(data.secure_url);

    toast.success("Image uploaded successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Upload ảnh thất bại!");
  } finally {
    setUploadingImage(false);
  }
};



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
        cover_image:
          coverImage || "/images/default-blog.jpg",
        published,
        category_id: categoryId,
        author_id: authorId,
      };

      if (mode === "create") {
        await createBlog(blogData);
      } else {
        await updateBlog(initialData!.id, blogData);
      }

      toast.success(
          mode === "create"
            ? "Post created successfully!"
            : "Post updated successfully!"
        );

      router.push("/dashboard/posts");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-4 gap-8 mt-8"
    >
      {/* ================= LEFT ================= */}

      <div className="col-span-3 space-y-6">

        {/* Title */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Title
          </label>

          <Input
            className="h-11"
            value={title}
            onChange={(e) => {
              const value = e.target.value;
              setTitle(value);
              setSlug(generateSlug(value));
            }}
            placeholder="Enter title"
          />
        </div>

        {/* Slug */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Slug
          </label>

          <Input
            className="h-11"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter slug"
          />
        </div>

        {/* Cover */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Cover Image URL
          </label>

                <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />

              {uploadingImage && (
                <p className="mt-2 text-sm text-gray-500">
                  Uploading image...
                </p>
              )}

          <div className="mt-4 overflow-hidden rounded-xl border bg-gray-50">
            <Image
              src={
                coverImage ||
                "/images/default-blog.jpg"
              }
              alt="Preview"
              width={1200}
              height={600}
              className="h-64 w-full object-cover"
            />
          </div>
        </div>

        {/* Content */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Content
          </label>

          <Textarea
            className="min-h-75"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />
        </div>

        {/* Excerpt */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Excerpt
          </label>

          <Textarea
            className="min-h-30"
            value={excerpt}
            onChange={(e) =>
              setExcerpt(e.target.value)
            }
            placeholder="Short description..."
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-6">

        {/* Publish */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">
            Publish
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) =>
                setPublished(e.target.checked)
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-medium">
              Published
            </span>
          </div>
        </div>

        {/* Category */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <label className="mb-3 block text-sm font-semibold text-gray-700">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(Number(e.target.value))
            }
            className="h-11 w-full rounded-md border px-3"
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

        {/* Author */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <label className="mb-3 block text-sm font-semibold text-gray-700">
            Author
          </label>

          <select
            value={authorId}
            onChange={(e) =>
              setAuthorId(Number(e.target.value))
            }
            className="h-11 w-full rounded-md border px-3"
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

        {/* Actions */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3">

        <Button
        type="submit"
        className="w-full"
        disabled={uploadingImage}
      >
        {mode === "create"
          ? "Create Post"
          : "Update Post"}
      </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                router.push("/dashboard/posts")
              }
            >
              Cancel
            </Button>

          </div>
        </div>

      </div>

    </form>
  );
}
