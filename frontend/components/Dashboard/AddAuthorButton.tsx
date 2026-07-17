"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddAuthorModal from "./AddAuthorModal";

export default function AddAuthorButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        + Add Author
      </Button>

      <AddAuthorModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}