# Security notes — patient data

This app stores sensitive patient health information. The app code is only part
of the picture: **the real security boundary is your Supabase configuration**
(Row Level Security + Auth settings). Work through the items below.

---

## 🔴 CRITICAL — fix before going live

### 1. Any logged-in user can read ALL patient records

Your current read policy is:

```sql
create policy "Admin can read all" on submissions
  for select using (auth.role() = 'authenticated');
```

`auth.role() = 'authenticated'` means **every signed-in user can read every
submission** — not just you. By default, Supabase lets *anyone* create an
account using the public anon key (which is, by design, embedded in the app's
JavaScript and visible to all patients). So as written, anyone could sign up and
read all your patients' data.

**Fix — do BOTH of these:**

**(a) Disable public sign-ups.** Supabase Dashboard → Authentication →
Sign In / Providers (or Settings) → turn **off** "Allow new users to sign up".
Create your admin account manually (Authentication → Users → Add user).

**(b) Lock policies to an explicit admin allowlist** (defence in depth, so a
future accidental re-enable of sign-ups can't leak data). Run this SQL in the
Supabase SQL editor:

```sql
-- Allowlist of admin user IDs
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table admins enable row level security;
-- (no policies on admins => only the service role can modify it; safe by default)

-- Add yourself: copy your UID from Authentication → Users
insert into admins (user_id) values ('YOUR-ADMIN-USER-UUID-HERE');

-- Replace the broad policies with admin-only ones
drop policy if exists "Admin can read all" on submissions;
drop policy if exists "Admin can update" on submissions;

create policy "Admins can read" on submissions
  for select using (exists (select 1 from admins a where a.user_id = auth.uid()));

create policy "Admins can update" on submissions
  for update using (exists (select 1 from admins a where a.user_id = auth.uid()));
```

After this, only user IDs listed in `admins` can read/update submissions, even
if they are authenticated.

---

## 🟠 Recommended hardening

### 2. Protect the public insert from abuse
`"Anyone can submit" ... with check (true)` is required so patients (anonymous)
can submit. But it also lets anyone with the anon key insert arbitrary rows.
Mitigations:
- Add sanity check constraints so junk is rejected:
  ```sql
  alter table submissions
    add constraint patient_name_len check (char_length(patient_name) between 1 and 120),
    add constraint odi_score_range check (odi_score is null or odi_score between 0 and 100),
    add constraint hads_a_range check (hads_anxiety is null or hads_anxiety between 0 and 21),
    add constraint hads_d_range check (hads_depression is null or hads_depression between 0 and 21);
  ```
- Consider a CAPTCHA (Supabase supports hCaptcha/Turnstile) on submit if spam appears.
- Keep Supabase's built-in rate limiting enabled.

### 3. Enable MFA
- On your **Supabase account** itself (protects the dashboard / project).
- Optionally for the in-app admin login — Supabase Auth supports TOTP MFA.

### 4. Backups & recovery
Enable Point-in-Time Recovery / daily backups for the project so patient data
can be restored. Decide on a data-retention policy.

### 5. Data residency & legal
Gensolve is an AU/NZ practice-management product, so this likely falls under the
Australian Privacy Act (APPs) or the NZ Privacy Act / Health Information Privacy
Code. Practical steps:
- Host the Supabase project in an appropriate region (e.g. **Sydney**) — set at
  project creation; can't be changed later.
- Review Supabase's terms/DPA and confirm they meet your obligations.
- Keep a record of consent and a privacy notice for patients.
- This is a legal/compliance matter — confirm with someone qualified, not just code.

---

## ✅ Already handled in the app

- **Anon key exposure is expected.** Supabase anon keys are meant to be public;
  security relies entirely on RLS — hence the items above.
- **Patients can't read the database.** After submitting, results are shown from
  what they just entered (in-memory), not re-fetched. No anonymous read path
  exists, so one patient can never see another's data.
- **PDFs are generated in the admin's browser.** Patient data is not sent to any
  third-party service to make the PDF.
- **No XSS sink.** React escapes all rendered values; no `dangerouslySetInnerHTML`.
- **Secrets are gitignored.** `.env` is excluded from version control.
- **HTTPS everywhere.** Vercel and Supabase serve over TLS.
