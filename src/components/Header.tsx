
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Search, Menu, X, ChevronRight } from "lucide-react";

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

  function searchNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchTerm = query.trim();

    if (searchTerm) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* Top information strip */}
      <div className="hidden border-b border-gray-100 bg-[#14243a] text-white sm:block">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-2 text-[10px] font-bold tracking-wide lg:px-8">
          <p className="text-white/80">
            NEWS 24 <span className="mx-2 text-red-400">/</span>
            দেশ, বিশ্ব ও ক্রিকেট
          </p>

          <p className="text-white/70">
            সত্যনিষ্ঠ সংবাদ, প্রতিদিন
          </p>
        </div>
      </div>

      {/* Main masthead */}
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-4 sm:px-5 lg:px-8 lg:py-5">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-200 text-[#14243a] transition hover:border-red-600 hover:bg-red-50 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2"
          aria-label="NEWS 24 হোমপেজ"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-11 w-1.5 bg-[#c8102e] transition-all duration-300 group-hover:h-12" />

          <span className="leading-none">
            <span className="block text-[27px] font-black tracking-[-0.07em] sm:text-3xl lg:text-[35px]">
              <span className="text-[#c8102e]">NEWS</span>
              <span className="text-[#14243a]">24</span>
            </span>

            <span className="mt-1 block text-[9px] font-bold tracking-[0.17em] text-gray-500 sm:text-[10px]">
              YOUR DAILY BRIEFING
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="প্রধান নেভিগেশন"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative py-3 text-[13px] font-extrabold text-[#26354a] transition-colors duration-200 hover:text-[#c8102e]"
            >
              {link.label}
              <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[#c8102e] transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Search control */}
        <button
          type="button"
          onClick={() => setSearchOpen((open) => !open)}
          className="flex h-10 shrink-0 items-center justify-center gap-2 border border-gray-200 px-3 text-[#14243a] transition hover:border-[#c8102e] hover:bg-red-50 sm:px-4"
          aria-label={searchOpen ? "সার্চ বন্ধ করুন" : "খবর খুঁজুন"}
          aria-expanded={searchOpen}
        >
          {searchOpen ? <X size={19} /> : <Search size={19} />}
          <span className="hidden text-xs font-bold sm:inline">
            {searchOpen ? "বন্ধ করুন" : "খবর খুঁজুন"}
          </span>
        </button>
      </div>

      {/* Search panel */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-[#f5f7fa]">
          <form
            onSubmit={searchNews}
            className="mx-auto flex max-w-[1500px] gap-2 px-4 py-4 sm:px-5 lg:px-8"
          >
            <label htmlFor="news-search" className="sr-only">
              খবর খুঁজুন
            </label>

            <input
              id="news-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="আপনার পছন্দের খবর লিখুন..."
              className="min-w-0 flex-1 border border-gray-300 bg-white px-4 py-3 text-sm text-[#14243a] outline-none transition placeholder:text-gray-400 focus:border-[#c8102e] focus:ring-2 focus:ring-red-100"
              autoFocus
            />

            <button
              type="submit"
              disabled={!query.trim()}
              className="flex shrink-0 items-center gap-2 bg-[#c8102e] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#a50d25] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
            >
              <Search size={17} />
              খুঁজুন
            </button>
          </form>
        </div>
      )}

      {/* Mobile navigation */}
      {menuOpen && (
        <nav
          aria-label="মোবাইল নেভিগেশন"
          className="border-t border-gray-200 bg-white px-4 py-3 shadow-lg md:hidden"
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="mb-2 flex items-center justify-between border-b border-gray-100 py-3 text-sm font-extrabold text-[#14243a]"
          >
            হোম
            <ChevronRight size={17} className="text-[#c8102e]" />
          </Link>

          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between border-b border-gray-100 py-3.5 text-sm font-bold text-[#26354a] transition-colors last:border-0 hover:text-[#c8102e]"
            >
              <span className="flex items-center gap-3">
                <span className="w-5 text-[10px] font-black text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {link.label}
              </span>

              <ChevronRight
                size={17}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#c8102e]"
              />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
