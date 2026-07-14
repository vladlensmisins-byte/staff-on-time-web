-- Manuelle Termine im Admin-Kalender (Business oder Bewerbung)
-- In Supabase: SQL Editor → Run

create table if not exists public.termins (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  termin_date date not null,
  termin_time text,
  kind text not null default 'business',
  contact_person text not null default '',
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists termins_date_idx on public.termins (termin_date);
create index if not exists termins_kind_idx on public.termins (kind);

alter table public.termins enable row level security;

create or replace function public.set_termins_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists termins_updated_at on public.termins;
create trigger termins_updated_at
  before update on public.termins
  for each row
  execute function public.set_termins_updated_at();
