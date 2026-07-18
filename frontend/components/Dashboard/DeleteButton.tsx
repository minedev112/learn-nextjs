"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteBlog } from "@/services/api";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps {
  id: number;
}

export default function DeleteButton({
  id,
}: DeleteButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteBlog(id);

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="rounded-lg"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete post?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently
              delete this blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}