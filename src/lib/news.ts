
export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: "bangla" | "international" | "cricket" | "magazine";
  categoryLabel: string;
  image: string;
  date: string;
  author: string;
  content: string;
};

export const news: NewsItem[] = [
  {
    slug: "bangladesh-development",
    title: "বাংলাদেশের উন্নয়ন ও অর্থনীতি নিয়ে নতুন আলোচনা",
    excerpt: "অর্থনীতি, কর্মসংস্থান ও উন্নয়ন পরিকল্পনা নিয়ে গুরুত্বপূর্ণ আলোচনা চলছে।",
    category: "bangla",
    categoryLabel: "বাংলাদেশ",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    date: "১৩ অক্টোবর ২০২৬",
    author: "NEWS 24 ডেস্ক",
    content: "এটি একটি নমুনা সংবাদ। এখানে সম্পাদকের লেখা সম্পূর্ণ খবর, যাচাই করা তথ্য এবং নির্ভরযোগ্য সূত্র যোগ করতে হবে।",
  },
  {
    slug: "world-technology",
    title: "বিশ্বজুড়ে প্রযুক্তি খাতে নতুন সম্ভাবনা",
    excerpt: "প্রযুক্তি ও উদ্ভাবনের নতুন অগ্রগতি নিয়ে আন্তর্জাতিক অঙ্গনে আলোচনা।",
    category: "international",
    categoryLabel: "আন্তর্জাতিক",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    date: "১৩ অক্টোবর ২০২৬",
    author: "International Desk",
    content: "এটি আন্তর্জাতিক সংবাদ বিভাগের নমুনা লেখা। প্রকাশের আগে তথ্য ও সূত্র যাচাই করতে হবে।",
  },
  {
    slug: "cricket-world",
    title: "ক্রিকেটে নতুন মৌসুম ঘিরে সমর্থকদের আগ্রহ",
    excerpt: "আসন্ন ম্যাচ ও দলের প্রস্তুতি নিয়ে ক্রিকেটপ্রেমীদের মধ্যে উৎসাহ।",
    category: "cricket",
    categoryLabel: "ক্রিকেট",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    date: "১৩ অক্টোবর ২০২৬",
    author: "Sports Desk",
    content: "এটি ক্রিকেট বিভাগের নমুনা সংবাদ। ম্যাচের স্কোর ও খবর প্রকাশের আগে নির্ভরযোগ্য সূত্র যাচাই করুন।",
  },
  {
    slug: "culture-and-life",
    title: "সংস্কৃতি, জীবনযাপন ও নতুন প্রজন্মের গল্প",
    excerpt: "জীবন, সংস্কৃতি ও মানুষের অভিজ্ঞতা নিয়ে বিশেষ আয়োজন।",
    category: "magazine",
    categoryLabel: "ম্যাগাজিন",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80",
    date: "১৩ অক্টোবর ২০২৬",
    author: "Magazine Desk",
    content: "এটি ম্যাগাজিন বিভাগের নমুনা লেখা।",
  },
  {
    slug: "global-environment",
    title: "পরিবেশ রক্ষায় বিশ্বব্যাপী উদ্যোগ বাড়ছে",
    excerpt: "পরিবেশ ও জলবায়ু নিয়ে বিভিন্ন উদ্যোগ গুরুত্ব পাচ্ছে।",
    category: "international",
    categoryLabel: "আন্তর্জাতিক",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    date: "১২ অক্টোবর ২০২৬",
    author: "NEWS 24 ডেস্ক",
    content: "পরিবেশবিষয়ক নমুনা সংবাদ।",
  },
  {
    slug: "sports-fans",
    title: "খেলাধুলার খবর জানতে ভক্তদের বাড়তি আগ্রহ",
    excerpt: "দেশ-বিদেশের খেলার খবর নিয়ে থাকছে নিয়মিত আয়োজন।",
    category: "cricket",
    categoryLabel: "ক্রিকেট",
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80",
    date: "১২ অক্টোবর ২০২৬",
    author: "Sports Desk",
    content: "খেলাধুলার নমুনা সংবাদ।",
  },
];

export const categoryInfo: Record<string, string> = {
  bangla: "বাংলাদেশ",
  international: "আন্তর্জাতিক",
  cricket: "ক্রিকেট",
  magazine: "ম্যাগাজিন",
};
