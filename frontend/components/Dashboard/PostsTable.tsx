import { getAuthors, getBlogs, getCategories } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

import DeleteButton from "./DeleteButton";

export default async function PostsTable() {
  const [blogs, authors, categories] = await Promise.all([
    getBlogs("", 0, 10),
    getAuthors(),
    getCategories(),
  ]);

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className=" text-[15px] text-gray-700">Image</TableHead>
              <TableHead className="text-[15px] text-gray-700">Title</TableHead>
              <TableHead className=" text-[15px] text-gray-700">Category</TableHead>
              <TableHead className=" text-[15px] text-gray-700">Author</TableHead>
              <TableHead className=" text-[15px] text-gray-700">Status</TableHead>
              <TableHead className=" text-[15px] text-gray-700 text-center">
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
          className="h-24 hover:bg-gray-50 transition-colors"
        >
                  <TableCell className="w-24">
                    <div className="flex justify-center">
                    <Image
                      src={
                        blog.cover_image ||
                        "/images/default-blog.jpg"
                      }
                      alt={blog.title}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover border shadow-sm"
                    />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <p className="text-[16px] font-semibold text-gray-900">
                        {blog.title}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {blog.slug}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {category?.name}
                    </Badge>
                  </TableCell>

                 <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        author?.avatar_url ||
                        "/images/default-avatar.jpg"
                      }
                      alt={author?.name || "Author"}
                      width={44}
                      height={44}
                      className="rounded-full object-cover border"
                    />

                    <div>
                      <p className="text-[15px] font-medium text-gray-900">
                        {author?.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                  <TableCell>
                    {blog.published ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1 flex items-center gap-2 w-fit">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Published
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border border-gray-200 px-3 py-1 flex items-center gap-2 w-fit">
                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                        Draft
                      </Badge>
                    )}
                </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                     <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                      >
                        <Link
                          href={`/dashboard/posts/${blog.id}/edit`}
                        >
                          Edit
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
      </CardContent>
    </Card>
  );
}