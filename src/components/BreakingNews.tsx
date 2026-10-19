
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  id: string;
  title: string;
  url: string;
};

type NewsResponse = {
  articles?: Article[];
  error?: string;
};

export default function BreakingNews() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let active = true;

    async function loadNews() {
      try {
        const response = await fetch("/api/news?category=latest");
        const data: NewsResponse = await response.json();

        if (active && response.ok && Array.isArray(data.articles)) {
          setArticles(
            data.articles.filter(
              (article) => article.title && article.url,
            ),
          );
        }
      } catch {
        if (active) {
          setArticles([]);
        }
      }
    }

    void loadNews();

    return () => {
      active = false;
    };
  }, []);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Breaking news headlines"
      className="w-full border-y border-slate-700 bg-slate-950 text-white"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-4">
        <span className="shrink-0 rounded bg-red-600 px-3 py-2 text-xs font-black tracking-wider text-white sm:text-sm">
          BREAKING
        </span>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track flex w-max shrink-0 items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center"
              >
                {articles.map((article, index) => (
                  <Link
                    key={`${copy}-${article.id}`}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="inline-flex shrink-0 items-center gap-3 px-5 text-sm font-medium text-slate-100 transition-colors hover:text-red-400 sm:text-base"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span>{article.title}</span>
                    {index !== articles.length - 1 && (
                      <span className="ml-2 text-slate-600">|</span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}