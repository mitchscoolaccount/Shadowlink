-- ============================================================
-- Multiplayer Pong lobbies
--
-- Same pattern as Shadow Crew's rooms: a lobby row is just
-- "who's in this match and what's its status" - the actual
-- gameplay (ball position, paddle movement, score) never touches
-- the database. It's pushed frame-by-frame over a Supabase
-- Realtime channel keyed by room code, host-authoritative, exactly
-- like Shadow Crew's kill/vote broadcasts.
--
-- Run this once in the SQL Editor of your real ShadowLink
-- database. Assumes current_nickname() and _check_rate_limit()
-- already exist (they do - every other feature this session uses
-- them).
-- ============================================================

create table if not exists public.pong_lobbies (
  id bigint generated always as identity primary key,
  room_code text not null unique,
  host_nickname text not null,
  guest_nickname text,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pong_lobbies_room_code_idx on public.pong_lobbies (room_code);
create index if not exists pong_lobbies_updated_at_idx on public.pong_lobbies (updated_at);

alter table public.pong_lobbies enable row level security;

drop policy if exists "pong_lobbies_select" on public.pong_lobbies;
create policy "pong_lobbies_select"
  on public.pong_lobbies for select
  to authenticated
  using (true);

-- No direct insert/update/delete policies - all writes go through the
-- SECURITY DEFINER functions below, so a lobby can't be tampered with
-- by anyone other than its actual host/guest.

create or replace function public.create_pong_lobby()
returns public.pong_lobbies
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nickname text := current_nickname();
  v_code text;
  v_row public.pong_lobbies;
  v_attempts int := 0;
begin
  if v_nickname is null then
    raise exception 'Not authenticated';
  end if;

  perform public._check_rate_limit(v_nickname, 'pong_lobby_create', 5, interval '1 minute');

  loop
    v_attempts := v_attempts + 1;
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 5));
    begin
      insert into public.pong_lobbies (room_code, host_nickname)
      values (v_code, v_nickname)
      returning * into v_row;
      exit;
    exception when unique_violation then
      if v_attempts > 10 then
        raise exception 'Could not generate a room code, try again';
      end if;
    end;
  end loop;

  return v_row;
end;
$$;

create or replace function public.join_pong_lobby(p_room_code text)
returns public.pong_lobbies
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nickname text := current_nickname();
  v_row public.pong_lobbies;
begin
  if v_nickname is null then
    raise exception 'Not authenticated';
  end if;

  perform public._check_rate_limit(v_nickname, 'pong_lobby_join', 10, interval '1 minute');

  select * into v_row
  from public.pong_lobbies
  where room_code = upper(p_room_code)
  for update;

  if v_row.id is null then
    raise exception 'No lobby with that code';
  end if;

  if v_row.host_nickname = v_nickname then
    raise exception 'You cannot join your own lobby';
  end if;

  if v_row.status <> 'waiting' or v_row.guest_nickname is not null then
    raise exception 'That lobby is already full';
  end if;

  update public.pong_lobbies
  set guest_nickname = v_nickname, status = 'playing', updated_at = now()
  where id = v_row.id
  returning * into v_row;

  return v_row;
end;
$$;

-- Called by either player on leaving/closing the game screen.
create or replace function public.leave_pong_lobby(p_lobby_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nickname text := current_nickname();
begin
  delete from public.pong_lobbies
  where id = p_lobby_id
    and (host_nickname = v_nickname or guest_nickname = v_nickname);
end;
$$;

-- Optional housekeeping - safe to run manually or on a schedule.
-- Clears out lobbies nobody ever joined or that got abandoned mid-game.
create or replace function public.cleanup_stale_pong_lobbies()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.pong_lobbies
  where updated_at < now() - interval '2 hours';
$$;
