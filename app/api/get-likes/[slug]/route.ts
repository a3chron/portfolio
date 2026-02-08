import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const slug = pathname.split("/").pop();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!(supabaseUrl && anonKey)) {
      console.error("failed to load env supabase variables");
      return NextResponse.json(
        { msg: "failed to load env variables" },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, anonKey);

    const { data, error } = await supabase
      .from("articles")
      .select("likes, dislikes")
      .eq("article_id", slug)
      .limit(1)
      .single();

    if (!data || error) {
      console.error(error);
      return NextResponse.json(
        {
          likes: 0,
          dislikes: 0,
          message: "Failed to retrieve likes from DB",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        likes: data.likes,
        dislikes: data.dislikes,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Failed to fetch likes: " + e);
    return NextResponse.json(
      {
        likes: -1,
        dislikes: -1,
        message: "Failed to fetch likes",
      },
      { status: 500 },
    );
  }
}
