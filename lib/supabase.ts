import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { allArticles } from "contentlayer/generated";

/**
 * Server-side Supabase client using the service-role key.
 * The service-role key bypasses RLS, so it must NEVER be exposed to the client
 * (do not prefix its env var with NEXT_PUBLIC_). Only import this from route
 * handlers / server code.
 *
 * Returns null when the required env vars are missing so callers can handle the
 * misconfiguration case gracefully.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!(supabaseUrl && serviceRoleKey)) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/**
 * Extracts the article slug from a request path, URL-decoding it so slugs with
 * percent-encoded characters still match. Returns undefined if the segment is
 * missing or malformed (decodeURIComponent throws on invalid sequences).
 */
export function slugFromPath(pathname: string): string | undefined {
  const raw = pathname.split("/").pop();
  if (!raw) return undefined;
  try {
    return decodeURIComponent(raw);
  } catch {
    return undefined;
  }
}

const knownArticleSlugs = new Set(
  allArticles.map((article) => article.slug),
);

/**
 * Whether the given slug belongs to a real article (published or draft — drafts
 * are still viewable and votable via their banner page). Used to guard the likes
 * endpoints so they can't be used to insert arbitrary rows.
 */
export function isKnownArticleSlug(slug: string | undefined): slug is string {
  return slug !== undefined && knownArticleSlugs.has(slug);
}

/**
 * Idempotently ensure a row exists for the given article. Inserts a fresh
 * { likes: 0, dislikes: 0 } row when missing; leaves an existing row untouched
 * (ignoreDuplicates), so counts are never clobbered.
 */
export async function ensureArticleRow(
  supabase: SupabaseClient,
  slug: string,
): Promise<void> {
  await supabase
    .from("articles")
    .upsert(
      { article_id: slug, likes: 0, dislikes: 0 },
      { onConflict: "article_id", ignoreDuplicates: true },
    );
}
