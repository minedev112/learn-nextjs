import { getCategories } from "@/services/api";
import CategoriesPageContent from "@/components/Dashboard/CategoriesPageContent";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-full bg-[#f5f6f8]">
      <CategoriesPageContent categories={categories} />
    </div>
  );
}