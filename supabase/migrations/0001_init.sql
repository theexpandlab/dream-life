-- Dream Life: initial schema. Paste into Supabase > SQL Editor > New query > Run.
-- Every table is private per user via row level security (RLS).

-- Profiles: one row per account, created automatically on sign-up.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  focus_areas text[] not null default '{}',
  reminder text not null default 'morning' check (reminder in ('morning','midday','evening','none')),
  dream_horizon text not null default 'y1' check (dream_horizon in ('y1','y3','y5')),
  premium boolean not null default false,
  onboarded_at timestamptz,
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Daily check-ins: one per day.
create table public.days (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  date date not null,
  career boolean not null default false,
  finance boolean not null default false,
  health boolean not null default false,
  family boolean not null default false,
  romance boolean not null default false,
  fun boolean not null default false,
  growth boolean not null default false,
  spirituality boolean not null default false,
  home boolean not null default false,
  contribution boolean not null default false,
  energy smallint check (energy between 1 and 5),
  win text not null default '',
  note text not null default '',
  saved_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- Monthly check-ins: one per month (first day of the month).
create table public.checkins (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  month date not null,
  career smallint check (career between 1 and 10),
  finance smallint check (finance between 1 and 10),
  health smallint check (health between 1 and 10),
  family smallint check (family between 1 and 10),
  romance smallint check (romance between 1 and 10),
  fun smallint check (fun between 1 and 10),
  growth smallint check (growth between 1 and 10),
  spirituality smallint check (spirituality between 1 and 10),
  home smallint check (home between 1 and 10),
  contribution smallint check (contribution between 1 and 10),
  win text not null default '',
  god text not null default '',
  focus text not null default '',
  saved_at timestamptz not null default now(),
  primary key (user_id, month)
);

-- Weekly resets: keyed by the Monday of the week.
create table public.weeks (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  week date not null,
  score smallint check (score between 1 and 10),
  win text not null default '',
  blocker text not null default '',
  next text not null default '',
  saved_at timestamptz not null default now(),
  primary key (user_id, week)
);

-- Goals: one per area.
create table public.goals (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  area text not null,
  goal text not null default '',
  action text not null default '',
  saved_at timestamptz not null default now(),
  primary key (user_id, area)
);

-- Win board.
create table public.wins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  text text not null,
  area text,
  date date not null default current_date,
  saved_at timestamptz not null default now()
);

-- Highlights (photos live in Storage bucket "photos", path {user_id}/...).
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  date date not null default current_date,
  title text not null default '',
  note text not null default '',
  image_path text,
  saved_at timestamptz not null default now()
);

-- The dump.
create table public.letgo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  text text not null,
  instead text not null default '',
  date date not null default current_date,
  released boolean not null default false,
  released_on date,
  saved_at timestamptz not null default now()
);

-- Dream You boards: y1, y3, y5.
create table public.dream_boards (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  horizon text not null check (horizon in ('y1','y3','y5')),
  photos text[] not null default '{}' check (cardinality(photos) <= 12),
  who text not null default '',
  feel text not null default '',
  day text not null default '',
  step text not null default '',
  saved_at timestamptz not null default now(),
  primary key (user_id, horizon)
);

-- Row level security: each person sees and edits only their own rows.
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

do $$
declare t text;
begin
  foreach t in array array['days','checkins','weeks','goals','wins','memories','letgo','dream_boards'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "own rows" on public.%I for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      t);
  end loop;
end $$;

-- Private photo storage: files go under a folder named after the user's id.
insert into storage.buckets (id, name, public) values ('photos', 'photos', false) on conflict do nothing;
create policy "own photos" on storage.objects for all
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
