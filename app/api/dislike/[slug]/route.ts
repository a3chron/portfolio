import { NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isKnownArticleSlug,
  slugFromPath,
} from "@/lib/supabase";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const slug = slugFromPath(pathname);

  if (!isKnownArticleSlug(slug)) {
    return NextResponse.json({ msg: "unknown article" }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.error("failed to load env supabase variables");
    return NextResponse.json(
      { msg: "failed to load env variables" },
      { status: 400 },
    );
  }

  // Atomic upsert-and-increment in a single row-locked statement (see the
  // increment_vote SQL function). Avoids the lost-update race of a
  // read-then-write and creates the row on the fly when missing.
  const { data, error } = await supabase
    .rpc("increment_vote", { p_article_id: slug, p_vote_type: "dislike" })
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "failed to update dislikes" },
      { status: 400 },
    );
  }

  const counts = (data ?? {}) as { likes?: number; dislikes?: number };
  return NextResponse.json(
    { msg: "updated dislikes", ...counts },
    { status: 201 },
  );
}
