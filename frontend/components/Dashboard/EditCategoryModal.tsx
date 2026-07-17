"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { category } from "@/typess/categories";
import { updateCategory } from "@/services/api";

interface EditCategoryModalProps {
  category: category;
  open: boolean;
  onClose: () => void;
}

export default function EditCategoryModal({
  category,
  open,
  onClose,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) return;

    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
  }, [category]);

  if (!open) return null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateCategory(category.id, {
        name,
        slug,
        description,
      });

      alert("Category updated successfully!");

      onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật category!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold">
            Edit category
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-xs font-medium">
                Name
              </label>

              <Input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-xs font-medium">
                Slug
              </label>

              <Input
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value)
                }
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-xs font-medium">
                Description
              </label>

              <Textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}