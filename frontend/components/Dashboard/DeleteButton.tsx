"use client";

import { Button } from "@/components/ui/button";
import { deleteBlog } from "@/services/api";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: number;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa bài viết này không?"
    );

    if (!confirmed) return;

    try {
      await deleteBlog(id);

      alert("Xóa bài viết thành công!");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    }
  };

  return (
   <Button
   variant="destructive"
    size="sm"
    className="rounded-lg"
    onClick={handleDelete}
>
  Delete
</Button>
    
  );
}