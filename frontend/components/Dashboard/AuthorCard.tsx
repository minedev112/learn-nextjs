"use client";

import Image from "next/image";
import { Author } from "@/typess/author";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditAuthorModal from "./EditAuthorModal";
import DeleteAuthorButton from "./DeleteAuthorButton";

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({
  author,
}: AuthorCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <Image
          src="/images/author/default-author.png"
          alt={author.name}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold">
            {author.name}
          </h3>

          <p className="text-sm text-gray-500">
            @{author.name.toLowerCase().replace(/\s+/g, "")}
          </p>
        </div>
      </div>

      <p className="mt-4 min-h-[48px] text-sm text-gray-600">
        {author.bio || "No bio available."}
      </p>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-sm text-gray-600">
          Author
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            Edit
          </Button>

          <DeleteAuthorButton id={author.id} />
        </div>
      </div>

      <EditAuthorModal
        author={author}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}