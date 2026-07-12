
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import PostForm from "@/components/Dashboard/PostForm";
import { getAuthors, getCategories } from "@/services/api";

export default async function NewPostPage() {
  const [authors, categories] = await Promise.all([
    getAuthors(),
    getCategories(),
  ]);

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <DashboardHeader title="New Post" />

      <PostForm
        authors={authors}
        categories={categories}
        mode="create"
      />
    </div>
  );
}