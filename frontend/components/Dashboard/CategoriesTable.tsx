"use client";

import { useState } from "react";
import { category } from "@/typess/categories";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import EditCategoryModal from "./EditCategoryModal";
import { deleteCategory } from "@/services/api";

interface CategoriesTableProps {
  categories: category[];
}

export default function CategoriesTable({
  categories,
}: CategoriesTableProps) {
  const [editCategory, setEditCategory] =
    useState<category | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteCategory(id);

      alert("Category deleted successfully!");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi xóa category!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full table-fixed">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="w-[22%] px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Name
              </th>

              <th className="w-[18%] px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Slug
              </th>

              <th className="w-[34%] px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Description
              </th>

              <th className="w-[10%] px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Posts
              </th>

              <th className="w-[16%] px-5 py-4 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-gray-50"
              >
                {/* Name */}
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />

                    <span className="font-semibold text-gray-900">
                      {category.name}
                    </span>
                  </div>
                </td>

                {/* Slug */}
                <td className="px-5 py-5 text-sm text-gray-500">
                  /{category.slug}
                </td>

                {/* Description */}
                <td className="px-5 py-5 text-sm text-gray-400">
                  <span className="block truncate">
                    {category.description || "No description"}
                  </span>
                </td>

                {/* Posts */}
                <td className="px-5 py-5 text-sm font-medium text-gray-700">
                  -
                </td>

                {/* Actions */}
                <td className="px-5 py-5">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setEditCategory(category)
                      }
                    >
                      <Pencil
                        size={15}
                        className="text-gray-500"
                      />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={deletingId === category.id}
                      onClick={() =>
                        handleDelete(category.id)
                      }
                    >
                      <Trash2
                        size={15}
                        className="text-gray-500"
                      />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editCategory && (
        <EditCategoryModal
          category={editCategory}
          open={true}
          onClose={() => setEditCategory(null)}
        />
      )}
    </>
  );
}