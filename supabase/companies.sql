-- Partner / Unternehmen CRM (Admin-Panel)
-- In Supabase: SQL Editor → New query → Run

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null default '',
  email text not null default '',
  phone text,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companies_status_idx on public.companies (status);
create index if not exists companies_created_at_idx on public.companies (created_at desc);

alter table public.companies enable row level security;

-- Service role (API) bypasses RLS; no public policies needed.

create or replace function public.set_companies_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists companies_updated_at on public.companies;
create trigger companies_updated_at
  before update on public.companies
  for each row
  execute function public.set_companies_updated_at();
