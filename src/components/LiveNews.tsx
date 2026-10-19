
"use client";

import { useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string | null;
  source: string;
  publishedAt: string;
};

type ApiResult = {
  articles?: Article[];
  error?: string;
};

export default function LiveNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadNews() {
      try {
        const response = await fetch("/api/news?category=latest", {
          signal: controller.signal,
        });

        const data: ApiResult = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "খবর আনা যায়নি।");
        }

        setArticles(data.articles ?? []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে।");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadNews();

    return () => controller.abort();
  }, []);

  if (loading) return <p className="p-6">খবর লোড হচ্ছে...</p>;

  if (error) {
    return <p className="p-6 text-red-600">খবর লোড হয়নি: {error}</p>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-5 border-l-4 border-red-600 pl-3 text-2xl font-black">
        সর্বশেষ সংবাদ
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article key={article.id} className="overflow-hidden rounded-xl border bg-white">
            {article.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.image}
                alt=""
                className="h-48 w-full object-cover"
                loading="lazy"
              />
            )}

            <div className="p-4">
              <p className="mb-2 text-xs font-bold text-red-600">
                {article.source}
              </p>
              <h3 className="font-bold leading-6">{article.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{article.summary}</p>
              <p className="mt-3 text-xs text-gray-500">
                {new Date(article.publishedAt).toLocaleString()}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-bold text-red-600 hover:underline"
              >
                মূল খবর পড়ুন ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
