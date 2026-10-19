
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 900;

const PLACEHOLDER = "/images/news-placeholder.svg";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
  category: string;
  categoryLabel: string;
};

type NewsApiArticle = {
  title: string | null;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source?: { name?: string };
};

type NewsDataArticle = {
  article_id?: string;
  title: string | null;
  description?: string | null;
  link: string;
  image_url?: string | null;
  pubDate?: string | null;
  source_name?: string | null;
};

const categories: Record<string, { query: string; label: string }> = {
  latest: {
    query:
      '(Bangladesh OR Dhaka OR "Bangladesh news" OR "বাংলাদেশ")',
    label: "Latest News",
  },
  bangla: {
    query:
      '(Bangladesh OR Dhaka OR "Bangladesh politics" OR "Bangladesh economy")',
    label: "Bangladesh",
  },
  international: {
    query: '"international news" OR "world news" OR "global affairs"',
    label: "World",
  },
  cricket: {
    query:
      'cricket OR "Bangladesh cricket" OR ICC OR "international cricket"',
    label: "Cricket",
  },
  magazine: {
    query: 'science OR technology OR business OR lifestyle',
    label: "Features",
  },
};

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

// SOURCE 1: NewsAPI
async function getNewsAPIArticles(
  category: string,
  search: string,
): Promise<NewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error("NEWS_API_KEY is missing");
  }

  const selected = categories[category];

  const query = search
    ? `(${selected.query}) AND "${search.replace(/"/g, "")}"`
    : selected.query;

  const params = new URLSearchParams({
    q: query,
    sortBy: "publishedAt",
    pageSize: "20",
    language: "en",
  });

  const response = await fetch(
    `https://newsapi.org/v2/everything?${params.toString()}`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
      next: {
        revalidate: 900,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`NewsAPI error: ${response.status}`);
  }

  const result = await response.json();

  if (result.status !== "ok") {
    throw new Error(result.message || "NewsAPI request failed");
  }

  const articles: NewsApiArticle[] = result.articles ?? [];

  return articles
    .filter((item) => item.title && item.url)
    .map((item) => ({
      id: item.url,
      title: item.title!,
      summary: item.description || item.title!,
      url: item.url,
      image: item.urlToImage?.trim() || PLACEHOLDER,
      source: item.source?.name || "NewsAPI",
      publishedAt: item.publishedAt || "",
      category,
      categoryLabel: selected.label,
    }));
}

// SOURCE 2: NewsData.io
async function getNewsDataArticles(
  category: string,
  search: string,
): Promise<NewsItem[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    throw new Error("NEWSDATA_API_KEY is missing");
  }

  const selected = categories[category];

  const query = search
    ? `(${selected.query}) AND (${search.replace(/"/g, "")})`
    : selected.query;

  const params = new URLSearchParams({
    apikey: apiKey,
    q: query,
    size: "10",
  });

  if (category === "bangla" || category === "latest") {
    params.set("country", "bd");
    params.set("language", "bn,en");
  } else {
    params.set("language", "en");
  }

  const response = await fetch(
    `https://newsdata.io/api/1/latest?${params.toString()}`,
    {
      next: {
        revalidate: 900,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`NewsData.io error: ${response.status}`);
  }

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(
      result.results?.message || "NewsData.io request failed",
    );
  }

  const articles: NewsDataArticle[] = result.results ?? [];

  return articles
    .filter((item) => item.title && item.link)
    .map((item) => ({
      id: item.article_id || item.link,
      title: item.title!,
      summary: item.description || item.title!,
      url: item.link,
      image: item.image_url?.trim() || PLACEHOLDER,
      source: item.source_name || "NewsData.io",
      publishedAt: item.pubDate || "",
      category,
      categoryLabel: selected.label,
    }));
}

// GET API
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const requestedCategory = searchParams.get("category") ?? "latest";

    const category = Object.hasOwn(categories, requestedCategory)
      ? requestedCategory
      : "latest";

    const search = searchParams.get("search")?.trim() ?? "";

    const [newsApiResult, newsDataResult] = await Promise.allSettled([
      getNewsAPIArticles(category, search),
      getNewsDataArticles(category, search),
    ]);

    const newsApiArticles =
      newsApiResult.status === "fulfilled" ? newsApiResult.value : [];

    const newsDataArticles =
      newsDataResult.status === "fulfilled" ? newsDataResult.value : [];

    const seenTitles = new Set<string>();
    const seenUrls = new Set<string>();

    const allArticles = [...newsDataArticles, ...newsApiArticles];

    const articles = allArticles
      .filter((article) => {
        const title = normalizeTitle(article.title);
        const normalizedUrl = article.url.trim().replace(/\/+$/, "");

        if (
          !title ||
          !normalizedUrl ||
          seenTitles.has(title) ||
          seenUrls.has(normalizedUrl)
        ) {
          return false;
        }

        seenTitles.add(title);
        seenUrls.add(normalizedUrl);

        return true;
      })
      .sort((a, b) => {
        const dateA = Date.parse(a.publishedAt) || 0;
        const dateB = Date.parse(b.publishedAt) || 0;
        return dateB - dateA;
      })
      .slice(0, 50);

    const sources = {
      newsApi: newsApiResult.status === "fulfilled",
      newsData: newsDataResult.status === "fulfilled",
    };

    const errors = {
      newsApi:
        newsApiResult.status === "rejected"
          ? newsApiResult.reason instanceof Error
            ? newsApiResult.reason.message
            : "NewsAPI unavailable"
          : null,

      newsData:
        newsDataResult.status === "rejected"
          ? newsDataResult.reason instanceof Error
            ? newsDataResult.reason.message
            : "NewsData.io unavailable"
          : null,
    };

    const anySourceAvailable = Object.values(sources).some(Boolean);

    return NextResponse.json(
      {
        success: anySourceAvailable,
        category,
        total: articles.length,
        sources,
        errors,
        articles,
      },
      {
        status: anySourceAvailable ? 200 : 502,
        headers: {
          "Cache-Control":
            "public, s-maxage=900, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch news";

    return NextResponse.json(
      {
        success: false,
        total: 0,
        articles: [],
        error: message,
      },
      { status: 500 },
    );
  }
}
