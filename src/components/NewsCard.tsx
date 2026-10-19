
import type { NewsItem } from "@/lib/news";
import NewsCardImage from "./NewsCardImage";

export default function NewsCard({
  item,
}: {
  item: NewsItem;
}) {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <NewsCardImage
          src={item.image}
          alt={item.title}
        />
      </div>

      <div className="p-4">
        <span className="text-xs font-extrabold text-red-600">
          {item.categoryLabel}
        </span>

        <h2 className="mt-2 text-lg font-extrabold leading-7 text-gray-900 group-hover:text-red-600">
          {item.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {item.excerpt}
        </p>

        <p className="mt-4 text-xs text-gray-500">
          {item.date} · {item.author}
        </p>
      </div>
    </article>
  );
}
