"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AuthorModalProps {
  children: React.ReactNode;
}

export default function AuthorModal({
  children,
}: AuthorModalProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle>
            Add Author
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Avatar URL
            </label>

            <Input
              value={avatar}
              onChange={(e) =>
                setAvatar(e.target.value)
              }
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

          <div className="flex justify-end gap-3">

            <Button
              variant="outline"
              type="button"
            >
              Cancel
            </Button>

            <Button>
              Save
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}