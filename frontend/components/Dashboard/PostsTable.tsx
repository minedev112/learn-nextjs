import { getAuthors, getBlogs, getCategories } from "@/services/api";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

import DeleteButton from "./DeleteButton";

export default async function PostsTable() {
  const [blogs, authors, categories] = await Promise.all([
    getBlogs("", 0, 10),
    getAuthors(),
    getCategories(),
  ]);

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <Table>
        <TableHeader className="bg-white">
          <TableRow className="hover:bg-white">
            <TableHead className="w-10"></TableHead>

            <TableHead className="text-[10px] uppercase text-gray-400">
              Post
            </TableHead>

            <TableHead className="text-[10px] uppercase text-gray-400">
              Category
            </TableHead>

            <TableHead className="text-[10px] uppercase text-gray-400">
              Author
            </TableHead>

            <TableHead className="text-[10px] uppercase text-gray-400">
              Status
            </TableHead>

            <TableHead className="text-[10px] uppercase text-gray-400">
              Date
            </TableHead>

            <TableHead className="text-right text-[10px] uppercase text-gray-400">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {blogs.map((blog) => {
            const author = authors.find(
              (a) => a.id === blog.author_id
            );

            const category = categories.find(
              (c) => c.id === blog.category_id
            );

            return (
              <TableRow
                key={blog.id}
                className="h-[64px] border-t hover:bg-gray-50"
              >
                {/* Checkbox */}
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5"
                  />
                </TableCell>

                {/* Post */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        blog.cover_image ||
                        "/images/default-blog.jpg"
                      }
                      alt={blog.title}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-md object-cover"
                    />

                    <div className="min-w-0">
                      <p className="max-w-[220px] truncate text-xs font-semibold text-gray-800">
                        {blog.title}
                      </p>

                      <p className="max-w-[220px] truncate text-[9px] text-gray-400">
                        /{blog.slug}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Badge className="rounded-sm bg-[#283A61] px-2 py-0.5 text-[9px] font-normal hover:bg-[#283A61]">
                    {category?.name}
                  </Badge>
                </TableCell>

                {/* Author */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        author?.avatar_url ||
                        "/images/author/default-author.png"
                      }
                      alt={author?.name || "Author"}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />

                    <span className="text-[10px] text-gray-700">
                      {author?.name}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {blog.published ? (
                    <Badge className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] text-green-700 hover:bg-green-100">
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                      Published
                    </Badge>
                  ) : (
                    <Badge className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] text-gray-500 hover:bg-gray-100">
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                      Draft
                    </Badge>
                  )}
                </TableCell>

                {/* Date */}
                <TableCell>
                  <span className="text-[9px] text-gray-400">
                    Jun 21, 2021
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <Link
                        href={`/dashboard/posts/${blog.id}/edit`}
                      >
                        <Pencil size={12} />
                      </Link>
                    </Button>

                    <DeleteButton id={blog.id} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-[9px] text-gray-400">
          Showing 1–{blogs.length} of 76 posts
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 text-xs"
          >
            ‹
          </Button>

          <Button
            size="icon"
            className="h-6 w-6 bg-[#283A61] text-xs"
          >
            1
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 text-xs"
          >
            2
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 text-xs"
          >
            3
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 text-xs"
          >
            4
          </Button>

          <span className="px-1 text-xs text-gray-400">
            ...
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 text-xs"
          >
            13
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 text-xs"
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}