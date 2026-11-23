-- Tester feedback from the open test version. Anyone can send; nobody can read through the app.
-- Read it in Supabase > Table Editor > feedback.
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(message) between 1 and 5000),
  name text not null default '' check (char_length(name) <= 100),
  page text not null default '' check (char_length(page) <= 100),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;
create policy "anyone can send feedback" on public.feedback for insert to anon, authenticated with check (true);
grant insert on public.feedback to anon, authenticated;
