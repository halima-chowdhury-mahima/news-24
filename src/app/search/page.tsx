
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { news } from "@/lib/news";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const term = q.trim().toLocaleLowerCase();

  const results = news.filter((item) =>
    `${item.title} ${item.excerpt} ${item.categoryLabel}`
      .toLocaleLowerCase()
      .includes(term),
  );

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-black">খবর খুঁজুন</h1>
        <p className="mt-2 mb-7 text-gray-500">
          “{q}” — {results.length}টি ফলাফল
        </p>

        {results.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <NewsCard key={item.slug} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600">
            কোনো খবর পাওয়া যায়নি। অন্য শব্দ দিয়ে খুঁজে দেখো।
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
