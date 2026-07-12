import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import PostsTable from "@/components/Dashboard/PostsTable";
//trang quản lý bài viết
export default function PostsPage() {
  return (
    <div className="bg-white rounded-xl shadow p-8">
      <DashboardHeader
  title="Posts"
  buttonText="New Post"
  buttonHref="/dashboard/posts/new"
/>

      <PostsTable />
    </div>
  );
}