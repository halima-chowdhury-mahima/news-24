
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { news, categoryInfo } from "@/lib/news";

export default function CategoryPage({
  category,
}: {
  category: string;
}) {
  const items =
    category === "latest"
      ? [...news]
      : news.filter((item) => item.category === category);

  const title = categoryInfo[category] ?? "সর্বশেষ খবর";

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10">
        <div className="mb-8 border-b border-gray-200 pb-5">
          <p className="text-sm font-bold text-red-600">NEWS 24 / বিভাগ</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h1>
          <p className="mt-2 text-gray-500">
            {title} বিভাগের সব খবর এক জায়গায়।
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <NewsCard key={item.slug} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-bold">এখনো কোনো খবর নেই</h2>
            <p className="mt-2 text-gray-500">
              পরে এই বিভাগে খবর প্রকাশ করা যাবে।
            </p>
            <Link href="/" className="mt-5 inline-block font-bold text-red-600">
              ← হোমপেজে ফিরে যান
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
