"use client";

import { useEffect, useState } from "react";
import { updateAuthor } from "@/services/api";
import { Author } from "@/typess/author";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditAuthorModalProps {
  author: Author;
  open: boolean;
  onClose: () => void;
}

export default function EditAuthorModal({
  author,
  open,
  onClose,
}: EditAuthorModalProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!author) return;

    setName(author.name);
    setAvatarUrl(author.avatar_url || "");
    setBio(author.bio || "");
  }, [author]);

  if (!open) return null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateAuthor(author.id, {
        name,
        avatar_url: avatarUrl,
        bio,
      });

      alert("Author updated successfully!");

      onClose();

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Edit Author
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Avatar URL
            </label>

            <Input
              value={avatarUrl}
              onChange={(e) =>
                setAvatarUrl(e.target.value)
              }
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Bio
            </label>

            <Textarea
              rows={5}
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">

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
                : "Save Changes"}
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
}