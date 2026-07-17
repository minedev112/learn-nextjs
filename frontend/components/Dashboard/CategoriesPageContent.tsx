"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  UserCircle,
} from "lucide-react";

import { category } from "@/typess/categories";
import CategoriesTable from "./CategoriesTable";
import AddCategoryModal from "./AddCategoryModal";

interface CategoriesPageContentProps {
  categories: category[];
}

export default function CategoriesPageContent({
  categories,
}: CategoriesPageContentProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b pb-6">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Organize your posts into topics
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              placeholder="Search categories..."
              className="w-64 pl-9"
            />
          </div>

          {/* Add Category */}
          <Button
            onClick={() => setAddOpen(true)}
            className="gap-2"
          >
            <Plus size={16} />
            Add Category
          </Button>

          {/* Avatar */}
          <UserCircle
            size={36}
            className="text-gray-500"
          />
        </div>
      </div>

      {/* Category count */}
      <p className="mb-4 text-sm text-gray-500">
        {categories.length} categories
      </p>

      {/* Table */}
      <CategoriesTable
        categories={categories}
      />

      {/* Add modal */}
      <AddCategoryModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </>
  );
}