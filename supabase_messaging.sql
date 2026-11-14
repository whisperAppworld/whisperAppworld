-- WhisperApp Real Messaging
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user1_id text not null,
  user2_id text not null,
  user1_name text,
  user2_name text,
  user1_img text,
  user2_img text,
  last_message text,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id text not null,
  sender_name text,
  text text not null,
  created_at timestamptz default now()
);
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
create policy "public read conversations" on public.conversations for select using (true);
create policy "public insert conversations" on public.conversations for insert with check (true);
create policy "public update conversations" on public.conversations for update using (true);
create policy "public read messages" on public.messages for select using (true);
create policy "public insert messages" on public.messages for insert with check (true);
