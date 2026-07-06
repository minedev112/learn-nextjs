import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field";
import { Label } from "radix-ui";


export default function SearchBar() {
    return (
<div className="flex justify-center">
  <Field orientation="horizontal" className="w-full max-w-lg">
    <Input type="search" placeholder="Search articles..." />
    <Button>Search</Button>
  </Field>
</div>
    )
}