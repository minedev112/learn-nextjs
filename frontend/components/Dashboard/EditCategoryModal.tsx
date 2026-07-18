"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { category } from "@/typess/categories";
import { updateCategory } from "@/services/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
    
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
           
              Edit category
            
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 py-4">
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <Textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
               className="min-h-[140px] text-base"
              />
            </div>
          </div>

          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    
  );
}