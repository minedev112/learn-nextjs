"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(
    searchParams.get("search") || ""
  );

  function handleSearch() {
    router.push(`/?page=1&search=${keyword}`);
  }

  return (
    <div className="flex justify-center">
      <Field orientation="horizontal" className="w-full max-w-xl">
       <Input
          type="search"
          placeholder="Search articles..."
          className="h-14 text-xl"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          />

        <Button onClick={handleSearch}>
          Search
        </Button>
      </Field>
    </div>
  );
}