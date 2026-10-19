
"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";

const links = [
  { label: "সর্বশেষ", href: "/latest" },
  { label: "বাংলাদেশ", href: "/bangla" },
  { label: "আন্তর্জাতিক", href: "/international" },
  { label: "ক্রিকেট", href: "/cricket" },
  { label: "ম্যাগাজিন", href: "/magazine" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function searchNews(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <button
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <Link href="/" className="shrink-0 text-3xl font-black tracking-tight">
          <span className="text-red-600">NEWS</span>
          <span className="text-gray-950"> 24</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-gray-700 transition hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="rounded-full p-2 hover:bg-gray-100"
          aria-label="Search news"
        >
          <Search size={22} />
        </button>
      </div>

      {searchOpen && (
        <form
          onSubmit={searchNews}
          className="mx-auto flex max-w-7xl gap-2 px-4 pb-4"
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="খবর খুঁজুন..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
          />
          <button className="rounded-lg bg-red-600 px-5 font-bold text-white hover:bg-red-700">
            খুঁজুন
          </button>
        </form>
      )}

      {menuOpen && (
        <nav className="border-t border-gray-100 px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-gray-100 py-3 font-semibold text-gray-800 last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
