-- MindMirror cloud sync schema
-- Run in Supabase SQL Editor for project: rfmpxoyauzwueoxleukf

create table if not exists public.mindmirror_states (
  device_id uuid primary key,
  encrypted_state text not null,
  updated_at timestamptz not null default now()
);

create index if not exists mindmirror_states_updated_at_idx
  on public.mindmirror_states (updated_at);

alter table public.mindmirror_states enable row level security;

-- Required when using publishable/anon key (service role bypasses RLS)
drop policy if exists "mindmirror_sync_all" on public.mindmirror_states;
create policy "mindmirror_sync_all"
  on public.mindmirror_states
  for all
  to anon, authenticated
  using (true)
  with check (true);

comment on table public.mindmirror_states is
  'Encrypted MindMirror state blobs by anonymous device_id. Payload is AES-GCM encrypted client-side.';
