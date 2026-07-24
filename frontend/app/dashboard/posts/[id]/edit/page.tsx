

import PostForm from "@/components/Dashboard/PostForm";
import { getAuthors, getCategories, getBlogsId } from "@/services/api";
interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({
  params,
}: EditPostPageProps) {
  const { id } = await params;
    const [blog, authors, categories] = await Promise.all([
  getBlogsId(Number(id)),
  getAuthors(),
  getCategories(),
]);

    console.log( blog);
 return (
  <div className="bg-white rounded-xl shadow p-8 mb-8">
    {/* <DashboardHeader title="Edit Post" /> */}
    
  <h1 className="text-4xl font-bold">
    Edit Post
  </h1>

  <p className="mt-2 text-gray-500">
    Manage all your blog articles
  </p>

    <PostForm
      authors={authors}
      categories={categories}
      initialData={blog}
      mode="edit"
    />
  </div>
);
}