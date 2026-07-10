-- Atomic upsert-and-increment for article likes/dislikes.
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- It replaces the old non-atomic read-then-write in the /api/like and
-- /api/dislike routes: the UPDATE below takes a row lock, so concurrent votes
-- can no longer lose an increment. The INSERT ... ON CONFLICT DO NOTHING creates
-- the row on the fly the first time an article is voted on.
--
-- Assumes a table:
--   create table articles (
--     article_id text primary key,
--     likes int not null default 0,
--     dislikes int not null default 0
--   );

create or replace function increment_vote(p_article_id text, p_vote_type text)
returns table (likes int, dislikes int)
language plpgsql
as $$
begin
  insert into articles (article_id, likes, dislikes)
  values (p_article_id, 0, 0)
  on conflict (article_id) do nothing;

  if p_vote_type = 'like' then
    update articles
      set likes = articles.likes + 1
      where article_id = p_article_id;
  elsif p_vote_type = 'dislike' then
    update articles
      set dislikes = articles.dislikes + 1
      where article_id = p_article_id;
  else
    raise exception 'invalid vote type: %', p_vote_type;
  end if;

  return query
    select a.likes, a.dislikes from articles a where a.article_id = p_article_id;
end;
$$;
