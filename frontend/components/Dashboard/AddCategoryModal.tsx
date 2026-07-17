"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/services/api";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({
  open,
  onClose,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name.");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        name,
        slug,
        description,
      });

      alert("Category created successfully!");

      setName("");
      setSlug("");
      setDescription("");

      onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo category!");
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
            Add category
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-xs font-medium">
                Name
              </label>

              <Input
                placeholder="e.g. Travel"
                value={name}
                onChange={(e) => {
                  const value = e.target.value;

                  setName(value);
                  setSlug(generateSlug(value));
                }}
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-xs font-medium">
                Slug
              </label>

              <Input
                placeholder="/travel"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value)
                }
                required
              />

              <p className="mt-1 text-[10px] text-gray-400">
                Auto-generated from name · edit to customize
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-xs font-medium">
                Description
              </label>

              <Textarea
                placeholder="What is this category about?"
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
                : "Save category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}