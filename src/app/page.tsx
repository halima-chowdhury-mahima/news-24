
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { news } from "@/lib/news";
import BreakingNews from "@/components/BreakingNews";
import LiveNews from "@/components/LiveNews";

type NewsItem = (typeof news)[number];

type ApiArticle = {
  title?: string;
  description?: string | null;
  content?: string | null;
  url?: string;
  image?: string | null;
  image_url?: string | null;
  publishedAt?: string;
  pubDate?: string;
  source?: string | { name?: string };
  category?: string | string[];
};

type ApiResponse = {
  articles?: ApiArticle[];
  news?: ApiArticle[];
  results?: ApiArticle[];
  error?: string;
};

type DisplayArticle = {
  title: string;
  description: string;
  url: string;
  image: string;
  date: string;
  category: string;
  source: string;
};

function CompactNewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex gap-3 border-b border-gray-200 py-4 last:border-b-0"
    >
      <div className="h-[86px] w-[108px] shrink-0 overflow-hidden bg-gray-100 sm:w-[125px]">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
          {item.categoryLabel}
        </span>

        <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-5 text-gray-900 transition group-hover:text-red-600 sm:text-[15px]">
          {item.title}
        </h3>

        <p className="mt-2 text-[11px] text-gray-500">{item.date}</p>
      </div>
    </Link>
  );
}

function SectionHeading({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-2">
      <h2 className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-gray-950 sm:text-xl">
        <span className="h-5 w-1 bg-red-600" />
        {title}
      </h2>

      <Link
        href={href}
        className="text-xs font-bold text-red-600 hover:text-black"
      >
        VIEW ALL →
      </Link>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "Latest update";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Latest update";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function getCategory(value?: string | string[]) {
  const text = (Array.isArray(value) ? value.join(" ") : value || "")
    .toLowerCase();

  if (text.includes("cricket") || text.includes("sport")) {
    return "Cricket";
  }

  if (text.includes("bangladesh") || text.includes("bangla")) {
    return "Bangladesh";
  }

  if (text.includes("world") || text.includes("international")) {
    return "International";
  }

  if (text.includes("magazine") || text.includes("lifestyle")) {
    return "Features";
  }

  return value
    ? Array.isArray(value)
      ? value[0]
      : value
    : "Latest News";
}

export default function HomePage() {
  // Static news only: used for Today's Headlines and editorial sections.
  const featured = news[0];
  const latest = news.slice(1);

  const sections = [
    { slug: "bangla", title: "Bangladesh" },
    { slug: "international", title: "World News" },
    { slug: "cricket", title: "Cricket" },
    { slug: "magazine", title: "Features" },
  ];

  const editorPicks = news.slice(0, 4);
  const mostRead = news.slice(0, 5);

  // API news is kept separate and used only in section 5.
  const [apiArticles, setApiArticles] = useState<DisplayArticle[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadLatestNews() {
      try {
        setApiLoading(true);
        setApiError("");

        const response = await fetch("/api/news?category=latest", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`News API request failed (${response.status}).`);
        }

        const data: ApiResponse = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Supports common response formats.
        const articles = Array.isArray(data.articles)
          ? data.articles
          : Array.isArray(data.news)
            ? data.news
            : Array.isArray(data.results)
              ? data.results
              : [];

        const normalized: DisplayArticle[] = articles
          .filter((article) => Boolean(article.title && article.url))
          .map((article) => ({
            title: article.title!,
            description:
              article.description ||
              article.content ||
              "Read the original report for more details.",
            url: article.url!,
            image:
              article.image ||
              article.image_url ||
              "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
            date: formatDate(article.publishedAt || article.pubDate),
            category: getCategory(article.category),
            source:
              typeof article.source === "string"
                ? article.source
                : article.source?.name || "News source",
          }));

        // Remove duplicate URLs and titles within API news only.
        const uniqueArticles = normalized.filter(
          (article, index, array) =>
            array.findIndex(
              (other) =>
                other.url === article.url ||
                other.title.trim().toLowerCase() ===
                  article.title.trim().toLowerCase(),
            ) === index,
        );

        setApiArticles(uniqueArticles);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setApiError(
          error instanceof Error
            ? error.message
            : "Unable to load the latest news.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setApiLoading(false);
        }
      }
    }

    void loadLatestNews();

    return () => controller.abort();
  }, []);

  return (
    <>
      <Header />
      <BreakingNews />

      <main className="min-h-screen bg-white text-gray-950">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <LiveNews />

          {/* 1. Welcome strip */}
          <div className="mt-5 flex items-center gap-3 border-y border-gray-200 py-3">
            <span className="shrink-0 bg-red-600 px-3 py-1.5 text-[10px] font-black tracking-widest text-white">
              NEWS 24
            </span>

            <p className="text-xs font-medium text-gray-600 sm:text-sm">
              Bangladesh, World & Cricket — Your daily briefing.
            </p>

            <span className="ml-auto hidden text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:block">
              Independent perspective
            </span>
          </div>

          {/* 2. Main editorial layout */}
          <section className="grid grid-cols-1 gap-6 py-7 lg:grid-cols-[190px_minmax(0,1fr)_250px] xl:grid-cols-[210px_minmax(0,1fr)_275px]">
            {/* Left sidebar */}
            <aside className="self-start lg:sticky lg:top-5">
              <div className="border-t-4 border-black bg-gray-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-600">
                  Your daily briefing
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  THE
                  <br />
                  BRIEF<span className="text-red-600">.</span>
                </h2>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  The stories shaping Bangladesh and the world.
                </p>

                <div className="my-5 border-y border-gray-200 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    In focus today
                  </p>

                  <div className="mt-3 space-y-3">
                    {[
                      { number: "01", label: "Bangladesh" },
                      { number: "02", label: "World Affairs" },
                      { number: "03", label: "Cricket" },
                    ].map((topic) => (
                      <div
                        key={topic.number}
                        className="flex items-center gap-3"
                      >
                        <span className="text-xs font-black text-red-600">
                          {topic.number}
                        </span>
                        <span className="text-sm font-bold">
                          {topic.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                    Breaking desk
                  </span>

                  <p className="mt-2 text-sm font-bold leading-6">
                    Follow the latest headlines and important developments.
                  </p>

                  <Link
                    href="/latest"
                    className="mt-3 inline-block text-xs font-black text-red-600 hover:text-black"
                  >
                    EXPLORE LATEST →
                  </Link>
                </div>
              </div>

              <div className="mt-4 border border-gray-200 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Explore
                </p>

                <div className="mt-3 space-y-3">
                  {sections.map((section) => (
                    <Link
                      key={section.slug}
                      href={`/${section.slug}`}
                      className="flex items-center justify-between text-sm font-bold hover:text-red-600"
                    >
                      {section.title}
                      <span className="text-red-600">↗</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* 3. Today's Headlines: static news only */}
            <div className="min-w-0">
              <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-2">
                <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
                  Today&apos;s Headlines
                </h1>

                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Top stories
                </span>
              </div>

              {featured ? (
                <Link
                  href={`/news/${featured.slug}`}
                  className="group block border-b border-gray-200 pb-5"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 sm:aspect-[16/8]">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />

                    <span className="absolute left-3 top-3 bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                      Top Story
                    </span>
                  </div>

                  <div className="pt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
                      {featured.categoryLabel}
                    </p>

                    <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight transition group-hover:text-red-600 sm:text-3xl lg:text-4xl">
                      {featured.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {featured.excerpt}
                    </p>

                    <p className="mt-3 text-[11px] text-gray-500">
                      {featured.date} · {featured.author}
                    </p>
                  </div>
                </Link>
              ) : (
                <p className="py-8 text-sm text-gray-500">
                  No static featured story is available.
                </p>
              )}

              {/* Static editorial updates */}
              <div className="mt-5">
                <SectionHeading title="Top Updates" href="/latest" />

                <div className="grid gap-x-5 sm:grid-cols-2 sm:gap-x-6">
                  {latest.slice(0, 4).map((item) => (
                    <CompactNewsCard key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Editorial sidebar */}
            <aside className="min-w-0">
              <div className="border-t-4 border-red-600 pt-3">
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Editor&apos;s Picks
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Stories worth your attention.
                </p>
              </div>

              <div className="mt-2">
                {editorPicks.map((item, index) => (
                  <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    className="group flex gap-3 border-b border-gray-200 py-3"
                  >
                    <span className="pt-1 text-2xl font-black text-gray-200">
                      0{index + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                        {item.categoryLabel}
                      </p>

                      <h3 className="mt-1 text-sm font-bold leading-5 group-hover:text-red-600">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-7 border-t-4 border-black pt-3">
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Most Read
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Popular headlines from our newsroom.
                </p>
              </div>

              <div className="mt-2">
                {mostRead.map((item, index) => (
                  <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    className="group flex gap-3 border-b border-gray-200 py-3"
                  >
                    <span className="text-xl font-black text-red-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-sm font-bold leading-5 group-hover:text-red-600">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>

              <Link
                href="/latest"
                className="mt-4 flex items-center justify-between border border-black px-4 py-3 text-xs font-black uppercase tracking-wider transition hover:bg-black hover:text-white"
              >
                More headlines <span>→</span>
              </Link>
            </aside>
          </section>

          {/* 5. Latest News: API news only */}
          <section className="border-t-4 border-red-600 py-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
                  NEWS 24 · Latest Updates
                </p>

                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  সর্বশেষ খবর
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Latest stories from Bangladesh, the world and cricket.
                </p>
              </div>

              <Link
                href="/latest"
                className="text-xs font-black text-red-600 transition hover:text-black"
              >
                VIEW ALL →
              </Link>
            </div>

            {apiLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((number) => (
                  <div
                    key={number}
                    className="animate-pulse border border-gray-200 p-4"
                  >
                    <div className="h-40 bg-gray-100" />
                    <div className="mt-4 h-3 w-1/3 bg-gray-200" />
                    <div className="mt-3 h-5 bg-gray-200" />
                    <div className="mt-2 h-4 w-2/3 bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : apiArticles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {apiArticles.slice(0, 9).map((article) => (
                  <article
                    key={article.url}
                    className="group overflow-hidden border border-gray-200 transition duration-300 hover:-translate-y-1 hover:border-red-600 hover:shadow-lg"
                  >
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                            {article.category}
                          </span>

                          <span className="text-[10px] text-gray-400">
                            {article.date}
                          </span>
                        </div>

                        <h3 className="mt-3 line-clamp-3 text-lg font-black leading-6 transition group-hover:text-red-600">
                          {article.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                          {article.description}
                        </p>

                        <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Source: {article.source} ↗
                        </p>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-gray-200 px-5 py-10 text-center">
                <h3 className="text-lg font-bold">
                  সর্বশেষ খবর এখন পাওয়া যাচ্ছে না
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {apiError ||
                    "The API returned no articles. Please try again later."}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-black"
                >
                  Try Again
                </button>
              </div>
            )}
          </section>

          {/* 6. All static news */}
          <section className="border-t-4 border-black py-7">
            <SectionHeading title="All News" href="/latest" />

            <div className="grid gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <CompactNewsCard key={item.slug} item={item} />
              ))}
            </div>
          </section>

          {/* 7. Category-specific static sections */}
          {sections.map((section) => {
            const items = news.filter(
              (item) => item.category === section.slug,
            );

            if (items.length === 0) return null;

            return (
              <section
                key={section.slug}
                className="border-t border-gray-300 py-7"
              >
                <SectionHeading
                  title={section.title}
                  href={`/${section.slug}`}
                />

                <div className="grid gap-x-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.slice(0, 6).map((item) => (
                    <CompactNewsCard key={item.slug} item={item} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* 8. Cricket highlights from static news */}
          <section className="mb-8 bg-black px-4 py-5 text-white sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                  The sports desk
                </p>

                <h2 className="mt-1 text-xl font-black uppercase tracking-tight sm:text-2xl">
                  Cricket <span className="text-red-500">/</span> Latest
                </h2>
              </div>

              <Link
                href="/cricket"
                className="border border-white/40 px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:border-red-500 hover:bg-red-600"
              >
                All cricket news →
              </Link>
            </div>

            <div className="mt-4 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {news
                .filter((item) => item.category === "cricket")
                .slice(0, 3)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    className="group border-t border-white/20 py-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-16 w-20 shrink-0 object-cover"
                      />

                      <div>
                        <h3 className="text-sm font-bold leading-5 group-hover:text-red-400">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-[10px] text-gray-400">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}