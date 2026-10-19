
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailsPage({
  params,
}: Props) {
  const { slug } = await params;

  const { data: article, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error("খবর লোড করা যায়নি।");
  }

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-block text-sm font-bold text-red-600 hover:underline"
        >
          ← NEWS 24 Homepage
        </Link>

        <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-red-600">
          {article.category_label}
        </p>

        <h1 className="text-3xl font-black leading-tight text-gray-900 sm:text-5xl">
          {article.title}
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          {article.excerpt}
        </p>

        <div className="mt-5 border-y border-gray-200 py-4 text-sm text-gray-500">
          {article.author} ·{" "}
          {new Date(
            article.published_at ?? article.created_at
          ).toLocaleDateString("bn-BD", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {article.image && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={article.image}
              alt={article.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-gray-800 sm:text-lg">
          {article.content}
        </div>
      </article>
    </main>
  );
}
