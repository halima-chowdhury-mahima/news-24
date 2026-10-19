
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("news_articles")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json(
      {
        connected: false,
        message: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    connected: true,
    message: "Supabase connected successfully!",
    tableAccessible: true,
    hasPublishedNews: data.length > 0,
  });
}
