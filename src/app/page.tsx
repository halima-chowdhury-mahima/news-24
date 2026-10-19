
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  ExternalLink,
  Flame,
  Globe2,
  Newspaper,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreakingNews from "@/components/BreakingNews";
import LiveNews from "@/components/LiveNews";
import { news } from "@/lib/news";

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

const fallbackImage =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=85";

const sections = [
  {
    slug: "bangla",
    title: "বাংলাদেশ",
    subtitle: "দেশের সর্বশেষ সংবাদ",
    english: "BANGLADESH",
  },
  {
    slug: "international",
    title: "আন্তর্জাতিক",
    subtitle: "বিশ্বজুড়ে যা ঘটছে",
    english: "WORLD NEWS",
  },
  {
    slug: "cricket",
    title: "ক্রিকেট",
    subtitle: "মাঠের খবর, খেলার আপডেট",
    english: "CRICKET",
  },
  {
    slug: "magazine",
    title: "ম্যাগাজিন",
    subtitle: "জীবন, সংস্কৃতি ও বিশেষ প্রতিবেদন",
    english: "FEATURES",
  },
];

function formatDate(value?: string) {
  if (!value) return "সর্বশেষ আপডেট";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "সর্বশেষ আপডেট";

  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function getCategory(value?: string | string[]) {
  const text = (Array.isArray(value) ? value.join(" ") : value || "")
    .toLowerCase();

  if (text.includes("cricket") || text.includes("sport")) {
    return "ক্রিকেট";
  }

  if (
    text.includes("bangladesh") ||
    text.includes("bangla") ||
    text.includes("national")
  ) {
    return "বাংলাদেশ";
  }

  if (
    text.includes("world") ||
    text.includes("international") ||
    text.includes("politics")
  ) {
    return "আন্তর্জাতিক";
  }

  if (text.includes("magazine") || text.includes("lifestyle")) {
    return "ফিচার";
  }

  return Array.isArray(value)
    ? value[0] || "সর্বশেষ খবর"
    : value || "সর্বশেষ খবর";
}

function SectionHeading({
  title,
  subtitle,
  href,
  english,
}: {
  title: string;
  subtitle?: string;
  href: string;
  english?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-2 border-[#14243a] pb-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-1 h-9 w-1 shrink-0 bg-[#c8102e]" />

        <div>
          {english && (
            <p className="mb-1 text-[9px] font-black tracking-[0.2em] text-[#c8102e] sm:text-[10px]">
              {english}
            </p>
          )}

          <h2 className="text-xl font-black tracking-tight text-[#14243a] sm:text-2xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <Link
        href={href}
        className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-xs font-extrabold text-[#c8102e] transition hover:text-[#14243a]"
      >
        সব দেখুন
        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

function CompactNewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex min-w-0 gap-3 border-b border-gray-200 py-4 transition-colors hover:border-gray-300"
    >
      <div className="h-[88px] w-[112px] shrink-0 overflow-hidden bg-gray-100 sm:h-[96px] sm:w-[132px]">
        <img
          src={item.image || fallbackImage}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-extrabold tracking-wide text-[#c8102e]">
          {item.categoryLabel}
        </span>

        <h3 className="mt-1 line-clamp-3 text-sm font-extrabold leading-5 text-[#14243a] transition-colors group-hover:text-[#c8102e] sm:text-[15px]">
          {item.title}
        </h3>

        <p className="mt-2 flex items-center gap-1 text-[10px] text-gray-500">
          <Clock3 size={11} />
          {item.date}
        </p>
      </div>
    </Link>
  );
}

function ApiNewsCard({ article }: { article: DisplayArticle }) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_35px_rgba(20,36,58,0.10)]">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col"
        aria-label={`${article.title} — মূল প্রতিবেদন পড়ুন`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={article.image || fallbackImage}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span className="absolute left-3 top-3 bg-[#c8102e] px-2.5 py-1 text-[10px] font-extrabold text-white">
            {article.category}
          </span>

          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center bg-white text-[#14243a] transition-colors group-hover:bg-[#c8102e] group-hover:text-white">
            <ExternalLink size={15} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <Clock3 size={12} />
            {article.date}
          </p>

          <h3 className="mt-3 line-clamp-3 text-lg font-black leading-7 text-[#14243a] transition-colors group-hover:text-[#c8102e]">
            {article.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
            {article.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-4 mt-5">
            <span className="min-w-0 truncate text-[10px] font-bold text-gray-500">
              সূত্র: {article.source}
            </span>

            <span className="shrink-0 text-xs font-extrabold text-[#c8102e]">
              পড়ুন ↗
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

function LoadingCard() {
  return (
    <div className="animate-pulse border border-gray-200 p-3">
      <div className="aspect-[16/10] bg-gray-100" />
      <div className="mt-4 h-3 w-1/3 bg-gray-200" />
      <div className="mt-4 h-5 w-full bg-gray-200" />
      <div className="mt-2 h-5 w-4/5 bg-gray-100" />
      <div className="mt-4 h-3 w-2/3 bg-gray-100" />
    </div>
  );
}

export default function HomePage() {
  const featured = news[0];
  const latest = news.slice(1);
  const editorPicks = news.slice(0, 4);
  const mostRead = news.slice(0, 5);

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
              "মূল প্রতিবেদনটি পড়ুন আরও বিস্তারিত জানতে।",
            url: article.url!,
            image: article.image || article.image_url || fallbackImage,
            date: formatDate(article.publishedAt || article.pubDate),
            category: getCategory(article.category),
            source:
              typeof article.source === "string"
                ? article.source
                : article.source?.name || "News source",
          }));

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

      <main className="min-h-screen bg-white text-[#172033]">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-5 lg:px-8">
          <LiveNews />

          {/* Editorial welcome strip */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-gray-200 py-3">
            <span className="bg-[#c8102e] px-3 py-1.5 text-[10px] font-black tracking-widest text-white">
              NEWS 24
            </span>

            <p className="text-xs font-semibold text-[#14243a] sm:text-sm">
              দেশ, বিশ্ব ও ক্রিকেট — আপনার প্রতিদিনের সংবাদ সঙ্গী।
            </p>

            <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 lg:ml-auto lg:block">
              News that matters
            </span>
          </div>

          {/* Main editorial grid */}
          <section className="grid grid-cols-1 gap-7 py-7 lg:grid-cols-[minmax(0,1fr)_285px] xl:grid-cols-[minmax(0,1fr)_315px] xl:gap-9">
            {/* Main content */}
            <div className="min-w-0">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1 bg-[#c8102e]" />
                  <h1 className="text-xl font-black tracking-tight text-[#14243a] sm:text-2xl">
                    আজকের প্রধান খবর
                  </h1>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Top Stories
                </span>
              </div>

              {featured ? (
                <div className="grid gap-5 border-b border-gray-200 pb-6 md:grid-cols-[1.2fr_0.8fr] md:gap-6 lg:gap-7">
                  <Link
                    href={`/news/${featured.slug}`}
                    className="group relative block min-w-0 overflow-hidden bg-gray-100"
                  >
                    <div className="aspect-[16/10] overflow-hidden sm:aspect-[5/4] md:aspect-[4/3]">
                      <img
                        src={featured.image || fallbackImage}
                        alt={featured.title}
                        fetchPriority="high"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <span className="absolute left-3 top-3 bg-[#c8102e] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white sm:left-4 sm:top-4">
                      Top Story
                    </span>

                    <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-white text-[#14243a] transition-colors group-hover:bg-[#c8102e] group-hover:text-white">
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>

                  <div className="flex min-w-0 flex-col justify-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c8102e] sm:text-xs">
                      {featured.categoryLabel}
                    </p>

                    <Link href={`/news/${featured.slug}`} className="group">
                      <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em] text-[#14243a] transition-colors group-hover:text-[#c8102e] sm:text-3xl lg:text-[34px] lg:leading-[1.2]">
                        {featured.title}
                      </h2>
                    </Link>

                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-gray-600 sm:text-[15px]">
                      {featured.excerpt}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-gray-200 pt-4 text-[11px] text-gray-500">
                      <span className="font-bold text-[#14243a]">
                        {featured.author}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#c8102e]" />
                      <span>{featured.date}</span>
                    </div>

                    <Link
                      href={`/news/${featured.slug}`}
                      className="mt-5 inline-flex w-fit items-center gap-2 bg-[#14243a] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#c8102e]"
                    >
                      বিস্তারিত পড়ুন
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="border border-gray-200 px-5 py-8 text-sm text-gray-500">
                  এই মুহূর্তে কোনো প্রধান খবর নেই।
                </p>
              )}

              {/* Top updates */}
              <section className="mt-7">
                <SectionHeading
                  title="সর্বশেষ আপডেট"
                  subtitle="গুরুত্বপূর্ণ খবরগুলো এক নজরে"
                  href="/latest"
                  english="LATEST UPDATES"
                />

                {latest.length > 0 ? (
                  <div className="grid gap-x-6 sm:grid-cols-2 sm:gap-x-7">
                    {latest.slice(0, 6).map((item) => (
                      <CompactNewsCard key={item.slug} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-sm text-gray-500">
                    নতুন খবর যোগ হলে এখানে দেখা যাবে।
                  </p>
                )}
              </section>
            </div>

            {/* Editorial sidebar */}
            <aside className="min-w-0">
              <div className="border-t-4 border-[#c8102e] bg-[#f5f7fa] p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c8102e]">
                  The Daily Brief
                </p>

                <h2 className="mt-2 text-3xl font-black leading-none tracking-[-0.05em] text-[#14243a] sm:text-4xl">
                  THE
                  <br />
                  BRIEF<span className="text-[#c8102e]">.</span>
                </h2>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  বাংলাদেশ ও বিশ্বের গুরুত্বপূর্ণ ঘটনাগুলো সম্পর্কে থাকুন
                  আপডেটেড।
                </p>

                <div className="mt-5 border-t border-gray-200 pt-4">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    In focus
                  </p>

                  {[
                    { number: "01", label: "বাংলাদেশ", href: "/bangla" },
                    {
                      number: "02",
                      label: "বিশ্ব সংবাদ",
                      href: "/international",
                    },
                    { number: "03", label: "ক্রিকেট", href: "/cricket" },
                  ].map((topic) => (
                    <Link
                      key={topic.number}
                      href={topic.href}
                      className="group flex items-center gap-3 border-b border-gray-200 py-3 last:border-b-0"
                    >
                      <span className="text-xs font-black text-[#c8102e]">
                        {topic.number}
                      </span>

                      <span className="flex-1 text-sm font-bold text-[#14243a] transition-colors group-hover:text-[#c8102e]">
                        {topic.label}
                      </span>

                      <ArrowUpRight
                        size={15}
                        className="text-gray-400 transition-colors group-hover:text-[#c8102e]"
                      />
                    </Link>
                  ))}
                </div>

                <Link
                  href="/latest"
                  className="mt-5 flex items-center justify-between border border-[#14243a] px-4 py-3 text-xs font-black text-[#14243a] transition hover:border-[#c8102e] hover:bg-[#c8102e] hover:text-white"
                >
                  সব খবর দেখুন
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Editor's picks */}
              <div className="mt-8">
                <div className="mb-2 flex items-center gap-2 border-b-2 border-[#14243a] pb-3">
                  <Flame size={18} className="text-[#c8102e]" />
                  <h2 className="text-lg font-black text-[#14243a]">
                    সম্পাদকের পছন্দ
                  </h2>
                </div>

                {editorPicks.length > 0 ? (
                  editorPicks.map((item, index) => (
                    <Link
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="group flex gap-3 border-b border-gray-200 py-4"
                    >
                      <span className="pt-0.5 text-2xl font-black leading-none text-gray-200 transition-colors group-hover:text-[#c8102e]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-extrabold text-[#c8102e]">
                          {item.categoryLabel}
                        </p>

                        <h3 className="mt-1 line-clamp-3 text-sm font-extrabold leading-5 text-[#14243a] transition-colors group-hover:text-[#c8102e]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-[10px] text-gray-500">
                          {item.date}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="py-4 text-sm text-gray-500">
                    কোনো প্রতিবেদন পাওয়া যায়নি।
                  </p>
                )}
              </div>

              {/* Most read */}
              <div className="mt-8">
                <div className="mb-2 flex items-center gap-2 border-b-2 border-[#14243a] pb-3">
                  <TrendingUp size={18} className="text-[#c8102e]" />
                  <h2 className="text-lg font-black text-[#14243a]">
                    জনপ্রিয় খবর
                  </h2>
                </div>

                {mostRead.map((item, index) => (
                  <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    className="group flex gap-3 border-b border-gray-200 py-3.5"
                  >
                    <span className="text-xl font-black leading-none text-[#c8102e]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-sm font-bold leading-5 text-[#14243a] transition-colors group-hover:text-[#c8102e]">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </aside>
          </section>

          {/* API latest news */}
          <section className="border-t-4 border-[#14243a] py-8 sm:py-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c8102e] sm:text-xs">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#c8102e]" />
                  NEWS 24 · Live Updates
                </p>

                <h2 className="text-2xl font-black tracking-tight text-[#14243a] sm:text-3xl">
                  সর্বশেষ খবর
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  বাংলাদেশ, বিশ্ব ও ক্রিকেটের সর্বশেষ সংবাদ।
                </p>
              </div>

              <Link
                href="/latest"
                className="group inline-flex items-center gap-2 border border-gray-300 px-4 py-2.5 text-xs font-extrabold text-[#14243a] transition hover:border-[#c8102e] hover:bg-[#c8102e] hover:text-white"
              >
                সব খবর
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {apiLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <LoadingCard key={index} />
                ))}
              </div>
            ) : apiArticles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {apiArticles.slice(0, 9).map((article) => (
                  <ApiNewsCard key={article.url} article={article} />
                ))}
              </div>
            ) : (
              <div className="border border-gray-200 bg-[#f8f9fb] px-5 py-10 text-center sm:py-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center bg-white text-[#c8102e] shadow-sm">
                  <Newspaper size={25} />
                </div>

                <h3 className="mt-4 text-lg font-black text-[#14243a]">
                  সর্বশেষ খবর এখন পাওয়া যাচ্ছে না
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                  {apiError ||
                    "এই মুহূর্তে API থেকে কোনো খবর পাওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করো।"}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 inline-flex items-center gap-2 bg-[#c8102e] px-5 py-3 text-xs font-black text-white transition hover:bg-[#14243a]"
                >
                  <RefreshCw size={15} />
                  আবার চেষ্টা করো
                </button>
              </div>
            )}
          </section>

          {/* All static news */}
          <section className="border-t border-gray-200 py-8">
            <SectionHeading
              title="সব খবর একসঙ্গে"
              subtitle="আমাদের প্রকাশিত প্রতিবেদনগুলো দেখুন"
              href="/latest"
              english="FROM THE NEWSROOM"
            />

            {news.length > 0 ? (
              <div className="grid gap-x-6 md:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                  <CompactNewsCard key={item.slug} item={item} />
                ))}
              </div>
            ) : (
              <p className="py-5 text-sm text-gray-500">
                কোনো খবর পাওয়া যায়নি।
              </p>
            )}
          </section>

          {/* Category sections */}
          {sections.map((section) => {
            const items = news.filter(
              (item) => item.category === section.slug,
            );

            if (items.length === 0) return null;

            return (
              <section
                key={section.slug}
                className="border-t border-gray-200 py-8"
              >
                <SectionHeading
                  title={section.title}
                  subtitle={section.subtitle}
                  href={`/${section.slug}`}
                  english={section.english}
                />

                <div className="grid gap-x-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.slice(0, 6).map((item) => (
                    <CompactNewsCard key={item.slug} item={item} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* Cricket spotlight */}
          <section className="my-8 overflow-hidden bg-[#14243a] text-white">
            <div className="h-1 bg-[#c8102e]" />

            <div className="p-5 sm:p-7 lg:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff6b7f]">
                    The Sports Desk
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    ক্রিকেট <span className="text-[#f0445e]">/</span> সর্বশেষ
                  </h2>

                  <p className="mt-2 text-sm text-gray-300">
                    ক্রিকেটের গুরুত্বপূর্ণ খবর ও আপডেট।
                  </p>
                </div>

                <Link
                  href="/cricket"
                  className="inline-flex items-center gap-2 border border-white/30 px-4 py-3 text-xs font-extrabold transition hover:border-[#c8102e] hover:bg-[#c8102e]"
                >
                  সব ক্রিকেট খবর
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="mt-5 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                {news
                  .filter((item) => item.category === "cricket")
                  .slice(0, 3)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="group border-t border-white/15 py-4"
                    >
                      <div className="flex gap-4">
                        <div className="h-[78px] w-[100px] shrink-0 overflow-hidden bg-white/10 sm:h-[86px] sm:w-[115px]">
                          <img
                            src={item.image || fallbackImage}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-3 text-sm font-extrabold leading-6 transition-colors group-hover:text-[#ff8494]">
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

              {news.filter((item) => item.category === "cricket").length ===
                0 && (
                <div className="mt-5 border-t border-white/15 py-5">
                  <div className="flex items-center gap-3">
                    <Globe2 size={20} className="text-[#ff8494]" />
                    <p className="text-sm text-gray-300">
                      নতুন ক্রিকেট প্রতিবেদন প্রকাশিত হলে এখানে দেখা যাবে।
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
