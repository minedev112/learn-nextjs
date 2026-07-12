import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  UserCircle,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#25345b] text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <h1 className="text-xl font-bold">
          Simple NextJS Blog
        </h1>
      </div>

      {/* Menu */}
      <div className="px-6 mt-8">
        <p className="text-xs uppercase text-gray-400 mb-4 tracking-wider">
          Manage
        </p>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/posts"
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#33497d]"
          >
            <FileText size={18} />
            Posts
          </Link>

          <Link
            href="/dashboard/authors"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <Users size={18} />
            Authors
          </Link>

          <Link
            href="/dashboard/categories"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <FolderOpen size={18} />
            Categories
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-white/10 p-6">
        <div className="flex items-center gap-3">
          <UserCircle size={36} />
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-gray-400">Editor</p>
          </div>
        </div>
      </div>
    </aside>
  );
}