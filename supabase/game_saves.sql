-- CAMINHOS: execute APENAS num projeto Supabase dedicado ao jogo.
-- Tabela privada: cada jogador só acessa o próprio save.
create table if not exists public.game_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint save_json_object check (jsonb_typeof(data) = 'object')
);
alter table public.game_saves enable row level security;
revoke all on public.game_saves from public, anon;
grant select, insert, update, delete on public.game_saves to authenticated;

drop policy if exists "game_saves_select_own" on public.game_saves;
create policy "game_saves_select_own"
  on public.game_saves for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "game_saves_insert_own" on public.game_saves;
create policy "game_saves_insert_own"
  on public.game_saves for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "game_saves_update_own" on public.game_saves;
create policy "game_saves_update_own"
  on public.game_saves for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "game_saves_delete_own" on public.game_saves;
create policy "game_saves_delete_own"
  on public.game_saves for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.caminhos_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.caminhos_set_updated_at() from public, anon, authenticated;
drop trigger if exists caminhos_game_saves_updated_at on public.game_saves;
create trigger caminhos_game_saves_updated_at
before update on public.game_saves
for each row execute function public.caminhos_set_updated_at();

-- Validar depois de executar:
-- select relrowsecurity from pg_class where oid='public.game_saves'::regclass;
-- select policyname,cmd,roles from pg_policies where schemaname='public' and tablename='game_saves';
