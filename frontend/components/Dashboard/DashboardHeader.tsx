import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, UserCircle } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  title: string;
  buttonText?: string;
  buttonHref?: string;
  showSearch?: boolean;
}

export default function DashboardHeader({
  title,
  buttonText,
  buttonHref,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          {title}
        </h1>

       <p className="mt-2 text-base text-gray-500">
          Manage all your blog articles
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            placeholder="Search posts..."
            className="pl-9 w-64 bg-white"
          />
        </div>

       {buttonText && buttonHref && (
          <Link href={buttonHref}>
            <Button
              className="h-[38px] w-[118px] rounded-lg px-4 py-2.5"
            >
              <Plus size={16} />
              {buttonText}
            </Button>
          </Link>
        )}
        <UserCircle
          size={34}
          className="text-gray-500"
        />
      </div>
    </div>
  );
}