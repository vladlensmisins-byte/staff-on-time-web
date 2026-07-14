-- Optional: link manual termins to a partner company
alter table public.termins
  add column if not exists company_id uuid references public.companies(id) on delete set null;

create index if not exists termins_company_id_idx on public.termins (company_id);
