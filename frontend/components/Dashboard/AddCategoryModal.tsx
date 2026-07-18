"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add category
          </DialogTitle>

          <DialogDescription>
            Create a new category to organize your posts.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
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
            <label className="mb-2 block text-sm font-medium">
              Slug
            </label>

            <Input
              placeholder="travel"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
              required
            />

            <p className="mt-1 text-xs text-gray-400">
              Auto-generated from name · edit to customize
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Textarea
              placeholder="What is this category about?"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="min-h-[100px]"
            />
          </div>

          {/* Footer */}
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
                : "Save category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}