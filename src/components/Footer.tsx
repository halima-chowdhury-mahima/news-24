
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <Link href="/" className="text-3xl font-black">
            <span className="text-red-500">NEWS</span> 24
          </Link>
          <p className="mt-3 max-w-md text-sm leading-7 text-gray-400">
            দেশ, বিশ্ব, ক্রিকেট ও জীবনযাপনের খবর এক জায়গায়।
          </p>
        </div>

        <div>
          <h3 className="font-bold">বিভাগসমূহ</h3>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-300">
            <Link href="/bangla" className="hover:text-white">বাংলাদেশ</Link>
            <Link href="/international" className="hover:text-white">আন্তর্জাতিক</Link>
            <Link href="/cricket" className="hover:text-white">ক্রিকেট</Link>
            <Link href="/magazine" className="hover:text-white">ম্যাগাজিন</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} NEWS 24. All rights reserved.
      </div>
    </footer>
  );
}
