"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header  className="py-6">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <h1 className="text-xl font-bold">
          Simple Next.js Blog
        </h1>

        {/* Menu */}
        <nav>
          <ul className="flex items-center gap-8 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-black">
                Blog
              </Link>
            </li>

            <li>
              <Link href="/" className="hover:text-black">
                About
              </Link>
            </li>

            <li>
              <Link href="/" className="hover:text-black">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}