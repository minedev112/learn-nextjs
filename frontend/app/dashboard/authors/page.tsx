import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import AuthorsGrid from "@/components/Dashboard/AuthorsGrid";
import AddAuthorButton from "@/components/Dashboard/AddAuthorButton";

export default function AuthorsPage() {
  return (
    <div>
      <DashboardHeader title="Authors" />

      <div className="mb-6 flex justify-end">
        <AddAuthorButton />
      </div>

      <AuthorsGrid />
    </div>
  );
}