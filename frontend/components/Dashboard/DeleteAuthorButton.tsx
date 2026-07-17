"use client";

import { deleteAuthor } from "@/services/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DeleteAuthorButtonProps {
  id: number;
}

export default function DeleteAuthorButton({
  id,
}: DeleteAuthorButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm(
      "Bạn có chắc muốn xóa author này không?"
    );

    if (!confirmed) return;

    try {
      await deleteAuthor(id);

      alert("Author deleted successfully!");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi xóa author!");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
}