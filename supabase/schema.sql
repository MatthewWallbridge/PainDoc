-- ============================================================
-- Paindoc — full database schema (consolidated, secure version)
-- ============================================================
-- Safe to run on a fresh project OR an existing one: it is
-- idempotent (re-running it will not error and will not delete
-- any rows). It brings the database to the secure target state.
-- ============================================================

-- ── Patient submissions ──────────────────────────────────────
create table if not exists submissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  patient_name    text not null,
  dob             text,
  assessment_date text,
  odi_answers     jsonb,
  odi_score       integer,
  hads_answers    jsonb,
  hads_anxiety    integer,
  hads_depression integer,
  ai_summary      text,                                 -- reserved for future AI summary
  delete_token    uuid default gen_random_uuid()        -- reserved; not used by the app
);

alter table submissions enable row level security;

-- ── Validation constraints (reject malformed / abusive inserts) ─
-- Dropped first so this block is safe to re-run.
alter table submissions drop constraint if exists patient_name_len;
alter table submissions drop constraint if exists odi_score_range;
alter table submissions drop constraint if exists hads_a_range;
alter table submissions drop constraint if exists hads_d_range;

alter table submissions
  add constraint patient_name_len check (char_length(patient_name) between 1 and 120),
  add constraint odi_score_range  check (odi_score is null or odi_score between 0 and 100),
  add constraint hads_a_range     check (hads_anxiety is null or hads_anxiety between 0 and 21),
  add constraint hads_d_range     check (hads_depression is null or hads_depression between 0 and 21);

-- ── Admin allowlist ──────────────────────────────────────────
-- Only user IDs in this table can read/update/delete submissions.
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table admins enable row level security;
-- No policies on `admins` => only the service role can change it. Safe by default.

-- ── Admin check helper ───────────────────────────────────────
-- SECURITY DEFINER so it can read `admins` without being blocked by that
-- table's own RLS. Policies that query `admins` directly would always return
-- false, because RLS hides every `admins` row from the calling user.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ── Row Level Security policies ──────────────────────────────
-- Remove any older / conflicting policies (old names included).
drop policy if exists "Anyone can submit"  on submissions;
drop policy if exists "Admin can read all"  on submissions;
drop policy if exists "Admin can update"    on submissions;
drop policy if exists "Delete by token"     on submissions;
drop policy if exists "Admins can read"      on submissions;
drop policy if exists "Admins can update"    on submissions;
drop policy if exists "Admins can delete"    on submissions;

-- Patients (anonymous) may only INSERT.
create policy "Anyone can submit" on submissions
  for insert with check (true);

-- Admins (allowlisted) may read / update / delete.
create policy "Admins can read"   on submissions for select using (public.is_admin());
create policy "Admins can update" on submissions for update using (public.is_admin());
create policy "Admins can delete" on submissions for delete using (public.is_admin());

-- ── Add your admin user (do this AFTER creating the account) ──
-- Get the UUID from Authentication → Users, then run:
-- insert into admins (user_id) values ('YOUR-ADMIN-USER-UUID-HERE');
