"use client";

import { useEffect, useState } from "react";
import { updateAuthor } from "@/services/api";
import { Author } from "@/typess/author";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const [uploadingImage, setUploadingImage] =
    useState(false);

  useEffect(() => {
    if (!author) return;

    setName(author.name);
    setAvatarUrl(author.avatar_url || "");
    setBio(author.bio || "");
  }, [author]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "upload_preset",
        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Upload image failed"
        );
      }

      setAvatarUrl(data.secure_url);
    } catch (error) {
      console.error(error);
      alert("Upload ảnh thất bại!");
    } finally {
      setUploadingImage(false);
    }
  };

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

      onClose();

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật author!");
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
            Edit Author
          </DialogTitle>

          <DialogDescription>
            Update author information.
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
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Avatar
            </label>

            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />

            {uploadingImage && (
              <p className="mt-2 text-sm text-gray-500">
                Uploading image...
              </p>
            )}

            {avatarUrl && (
              <div className="mt-3">
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="h-20 w-20 rounded-full object-cover border"
                />
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Bio
            </label>

            <Textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              placeholder="A short bio..."
              className="min-h-[100px]"
            />
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
              disabled={
                loading || uploadingImage
              }
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}