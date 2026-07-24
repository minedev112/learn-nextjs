"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  UserCircle,
  LogOut,
} from "lucide-react";

import { logout } from "@/lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{
  username: string;
  role?: string;
} | null>(null);



useEffect(() => {
  async function fetchUser() {
    try {
      const data = await getCurrentUser();
      console.log("Current user:", data);
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  }

  fetchUser();
}, []);
function handleLogout() {
  logout();
  router.replace("/login");
}

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Posts",
      href: "/dashboard/posts",
      icon: FileText,
    },
    {
      label: "Authors",
      href: "/dashboard/authors",
      icon: Users,
    },
    {
      label: "Categories",
      href: "/dashboard/categories",
      icon: FolderOpen,
    },
  ];

  return (
    <aside className="flex min-h-screen w-[240px] flex-col bg-[#283A61] text-white">
      {/* Logo */}
      <div className="border-b border-white/10 px-4 py-6">
        <h1 className="text-base font-bold">
          Simple NextJS Blog
        </h1>
      </div>

      {/* Menu */}
      <div className="mt-7 px-4">
        <p className="mb-4 text-[10px] uppercase tracking-wider text-gray-400">
          Manage
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-[#4669A8]"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <UserCircle size={32} />

              <div>
                    <p className="text-sm font-medium">
            {user?.username ?? "Loading..."}
          </p>

          <p className="text-[10px] text-gray-400">
            {user?.role ?? "Editor"}
          </p>
          </div>
        </div>
              <button
        onClick={handleLogout}
        className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
      >
        <LogOut size={16} />
        Logout
      </button>

      </div>

          
    </aside>
  );
}