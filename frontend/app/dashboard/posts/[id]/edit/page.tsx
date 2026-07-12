
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
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
  <div className="bg-white rounded-xl shadow p-8">
    <DashboardHeader title="Edit Post" />

    <PostForm
      authors={authors}
      categories={categories}
      initialData={blog}
      mode="edit"
    />
  </div>
);
}