"use client";

import { useState } from "react";
import { deleteAuthor } from "@/services/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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

interface DeleteAuthorButtonProps {
  id: number;
}

export default function DeleteAuthorButton({
  id,
}: DeleteAuthorButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteAuthor(id);

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi xóa author!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
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
              Delete author?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently
              delete this author.
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