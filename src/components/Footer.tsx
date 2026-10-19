"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowUp,
  Newspaper,
} from "lucide-react";

const categories = [
  { label: "সর্বশেষ খবর", href: "/latest" },
  { label: "বাংলাদেশ", href: "/bangla" },
  { label: "আন্তর্জাতিক", href: "/international" },
  { label: "ক্রিকেট", href: "/cricket" },
  { label: "ম্যাগাজিন", href: "/magazine" },
];

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#14243a] text-white">
      {/* Top accent */}
      <div className="h-1 w-full bg-[#c8102e]" />

      <div className="mx-auto max-w-[1500px] px-5 py-10 sm:py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label="NEWS 24 হোমপেজ"
            >
              <span className="flex h-12 w-1.5 bg-[#c8102e] transition-all duration-300 group-hover:h-14" />

              <span className="leading-none">
                <span className="block text-3xl font-black tracking-[-0.06em] sm:text-4xl">
                  <span className="text-[#f0445e]">NEWS</span>
                  <span className="text-white">24</span>
                </span>

                <span className="mt-2 block text-[10px] font-bold tracking-[0.2em] text-gray-400">
                  YOUR DAILY BRIEFING
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-300">
              দেশ, বিশ্ব, ক্রিকেট ও জীবনযাপনের গুরুত্বপূর্ণ খবর এক জায়গায়।
              প্রতিদিনের খবর ও ঘটনাপ্রবাহ সম্পর্কে থাকুন আপডেটেড।
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Newspaper size={16} className="text-[#f0445e]" />
              <span>News that matters</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-5 w-1 bg-[#c8102e]" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                বিভাগসমূহ
              </h2>
            </div>

            <nav
              aria-label="ফুটার বিভাগসমূহ"
              className="grid grid-cols-2 gap-x-5 gap-y-4"
            >
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 shrink-0 bg-[#f0445e] transition-all group-hover:h-2 group-hover:w-2" />
                  <span>{category.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick links */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-5 w-1 bg-[#c8102e]" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                দ্রুত লিংক
              </h2>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
                className="group flex items-center justify-between border-b border-white/10 pb-3 text-sm text-gray-300 transition hover:text-white"
              >
                হোমপেজ
                <ArrowUpRight
                  size={16}
                  className="text-[#f0445e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/latest"
                className="group flex items-center justify-between border-b border-white/10 pb-3 text-sm text-gray-300 transition hover:text-white"
              >
                সর্বশেষ আপডেট
                <ArrowUpRight
                  size={16}
                  className="text-[#f0445e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/search"
                className="group flex items-center justify-between border-b border-white/10 pb-3 text-sm text-gray-300 transition hover:text-white"
              >
                খবর খুঁজুন
                <ArrowUpRight
                  size={16}
                  className="text-[#f0445e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial statement */}
        <div className="mt-10 border-y border-white/10 py-5 sm:mt-14">
          <p className="text-center text-xs font-semibold leading-6 text-gray-400 sm:text-sm">
            বাংলাদেশের খবর, বিশ্বের খবর — আপনার প্রতিদিনের সংবাদ সঙ্গী।
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-extrabold text-white">NEWS 24</span>.
            All rights reserved.
          </p>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="group inline-flex items-center gap-2 border border-white/20 px-4 py-2.5 text-xs font-bold text-gray-300 transition hover:border-[#f0445e] hover:bg-[#c8102e] hover:text-white"
          >
            উপরে যান
            <ArrowUp
              size={15}
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
