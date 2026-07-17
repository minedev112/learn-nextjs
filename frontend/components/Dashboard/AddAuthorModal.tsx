"use client";

import { useState } from "react";
import { createAuthor } from "@/services/api";
import { useRouter } from "next/navigation";

interface AddAuthorModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAuthorModal({
  open,
  onClose,
}: AddAuthorModalProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createAuthor({
        name,
        avatar_url: avatarUrl,
        bio,
      });

      alert("Author created successfully!");

      setName("");
      setAvatarUrl("");
      setBio("");

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
            Add Author
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

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full rounded-md border p-2"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Avatar URL
            </label>

            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://.../avatar.jpg"
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio..."
              className="min-h-[100px] w-full rounded-md border p-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-800 px-4 py-2 text-white"
            >
              {loading ? "Saving..." : "Save Author"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}