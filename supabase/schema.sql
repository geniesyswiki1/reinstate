-- Reinstate data model, section 4.4. Run once against a fresh Supabase project.
-- Every table is service-role only: the app never exposes an anon key, and access
-- to a case is by its 32 character token through the server.

create extension if not exists "pgcrypto";

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  email text,
  platform text,
  case_type text,
  confidence numeric,
  notice_text text,
  deadline text,
  status text not null default 'classified',
  purchase_id uuid,
  source text not null default 'web',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);
create index if not exists cases_email_idx on cases (email);
create index if not exists cases_expires_idx on cases (expires_at);

create table if not exists answers (
  case_id uuid not null references cases (id) on delete cascade,
  question_id text not null,
  value text,
  updated_at timestamptz not null default now(),
  primary key (case_id, question_id)
);

create table if not exists evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases (id) on delete cascade,
  filename text not null,
  storage_path text not null,
  doc_type text,
  extracted_json jsonb,
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists evidence_case_idx on evidence (case_id);

create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases (id) on delete cascade,
  version integer not null,
  body_md text not null,
  body_txt text not null,
  created_at timestamptz not null default now(),
  unique (case_id, version)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references drafts (id) on delete cascade,
  report_json jsonb not null,
  blocking_count integer not null default 0,
  advisory_count integer not null default 0,
  generic_max numeric not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists reviews_draft_idx on reviews (draft_id);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_order_id text not null,
  email text not null,
  tier text not null,
  amount integer not null,
  currency text not null default 'GBP',
  case_id uuid references cases (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (provider, provider_order_id)
);

create table if not exists outcomes (
  case_id uuid primary key references cases (id) on delete cascade,
  result text not null,
  rejection_text text,
  recorded_at timestamptz not null default now()
);

-- Free classifications, held so a Lemon Squeezy webhook can build the case from one.
create table if not exists classifications (
  id uuid primary key default gen_random_uuid(),
  platform text,
  case_type text,
  confidence numeric,
  notice_text text,
  deadline text,
  report_json jsonb,
  created_at timestamptz not null default now()
);
create index if not exists classifications_created_idx on classifications (created_at);

-- Magic links. Only the hash is stored.
create table if not exists magic_links (
  token_hash text primary key,
  email text not null,
  case_token text not null,
  expires_at timestamptz not null,
  used_at timestamptz
);

alter table cases enable row level security;
alter table answers enable row level security;
alter table evidence enable row level security;
alter table drafts enable row level security;
alter table reviews enable row level security;
alter table purchases enable row level security;
alter table outcomes enable row level security;
alter table classifications enable row level security;
alter table magic_links enable row level security;

-- No policies are defined on purpose. Only the service role reaches these tables.

-- Private bucket for uploads, signed URLs only (section 4.7).
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing;

-- Nightly purge, called by the scheduled Netlify function.
create or replace function purge_expired_cases()
returns table (purged_case_id uuid, storage_path text)
language sql
security definer
set search_path = public
as $$
  with expired as (
    select id from cases where expires_at < now()
  ),
  paths as (
    -- Collected before the delete, because evidence rows cascade away with the case.
    select ev.case_id, ev.storage_path from evidence ev join expired e on ev.case_id = e.id
  ),
  deleted as (
    delete from cases where id in (select id from expired) returning id
  )
  select p.case_id, p.storage_path from paths p
  union all
  select d.id, null::text from deleted d where not exists (select 1 from paths p where p.case_id = d.id);
$$;
