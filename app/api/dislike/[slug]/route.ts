import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const slug = pathname.split("/").pop();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!(supabaseUrl && anonKey)) {
    console.error("failed to load env supabase variables");
    return NextResponse.json(
      { msg: "failed to load env variables" },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, anonKey);

  const { data } = await supabase
    .from("articles")
    .select("dislikes")
    .eq("article_id", slug)
    .limit(1)
    .single();

  if (!data) {
    return NextResponse.json(
      { msg: "failed to retrieve previous dislikes" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("articles")
    .update({ dislikes: data.dislikes + 1 })
    .eq("article_id", slug);

  if (error) {
    return NextResponse.json(
      { msg: "failed to update dislikes" },
      { status: 400 }
    );
  }

  return NextResponse.json({ msg: "updated dislikes" }, { status: 201 });
}
