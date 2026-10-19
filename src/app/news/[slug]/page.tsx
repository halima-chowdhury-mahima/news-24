
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { news } from "@/lib/news";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = news.find((item) => item.slug === slug);

  return {
    title: article ? article.title : "News Not Found",
    description: article?.excerpt ?? "NEWS 24-এর সর্বশেষ সংবাদ পড়ুন।",
  };
}

export default async function NewsDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const article = news.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-700"
            >
              <ArrowLeft size={17} />
              হোমপেজে ফিরে যান
            </Link>
          </div>
        </div>

        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-700">
            <Newspaper size={16} />
            {article.categoryLabel}
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-[#14243a] sm:text-5xl sm:leading-tight">
            {article.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
            {article.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4 border-y border-slate-200 py-4 text-sm text-slate-500">
            <span className="font-bold text-slate-700">
              {article.author || "NEWS 24 ডেস্ক"}
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              {article.date}
            </span>
          </div>

          {article.image && (
            <div className="mt-8 overflow-hidden border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image}
                alt={article.title}
                className="max-h-[560px] w-full object-cover"
              />
            </div>
          )}

          <div className="mt-9 whitespace-pre-line text-base leading-9 text-slate-700 sm:text-lg">
            {article.content || article.excerpt}
          </div>

          <div className="mt-12 border-t-2 border-[#14243a] pt-6">
            <Link
              href="/latest"
              className="inline-flex items-center gap-2 bg-[#c8102e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#14243a]"
            >
              আরও খবর পড়ুন
              <ArrowLeft className="rotate-180" size={17} />
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
