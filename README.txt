Pong - Online Multiplayer (room-code lobbies)
============================================================

What this adds
------------------------------------------------------------
- Create a lobby, get a 5-character room code, share it with a friend.
- They join with the code -> match starts automatically (short
  countdown) once you're both in.
- Real 1v1 Pong: arrow keys or W/S to move your paddle, first to 7
  points wins, "Rematch" button to go again without leaving the room.
- Nothing about a match (ball position, paddle position, score) is
  ever written to the database - it's all sent live between the two
  players over a Supabase Realtime channel, the same way Shadow
  Crew's kills/votes work. Only the lobby itself (who's in it, room
  code, status) is a database row, and it's deleted the moment either
  player leaves.
- One player is the "host" (whoever created the lobby) - their
  browser runs the actual physics (ball movement, collisions,
  scoring) and streams the result to the other player, who just sends
  their own paddle position back. This is the same trust model Shadow
  Crew already uses (whoever hosts a match is trusted not to cheat) -
  true tamper-proof server-side physics would mean running the game
  loop in a Postgres/edge function instead of a browser, which is a
  much bigger project than this delivery.

Files in this zip
------------------------------------------------------------
pong_multiplayer.sql                          - run once in Supabase
src/components/PongLobby.tsx                  - create/join screen
src/components/PongMultiplayerGame.tsx        - the actual game
src/app/games/pong-online/page.tsx            - the route

Verified against your real app's toolchain (I have a local sandbox
synced to an earlier snapshot of your repo, missing a lot of what
you've shipped since, but the parts these files depend on -
UserContext, the Supabase browser client, styling tokens - haven't
changed): tsc --noEmit and eslint both pass clean on all three new
files, and `next build` compiles and type-checks them successfully
(the only build failure I saw was a pre-existing, unrelated one on
/complete-profile caused by this sandbox not having your real
Supabase env vars set - nothing to do with Pong).

Steps
------------------------------------------------------------
1. Run pong_multiplayer.sql once in your Supabase SQL Editor (the
   real ShadowLink project, not a test one).

2. From your repo root, unzip and copy the three files in. This zip
   has NO top-level wrapper folder, so a straight unzip drops files
   directly where they belong:

   unzip -o pong_multiplayer_delivery.zip -d .

   git status should show exactly:
     new file:   pong_multiplayer.sql
     new file:   src/components/PongLobby.tsx
     new file:   src/components/PongMultiplayerGame.tsx
     new file:   src/app/games/pong-online/page.tsx

3. Add an entry so it shows up on your Games hub page. I don't have
   an up-to-date copy of that file to edit directly (a lot has
   shipped since my local snapshot), so open
   src/app/(app)/games/page.tsx (or wherever your GAMES array
   actually lives now) and add an object shaped like your existing
   Pong/Shadow Crew entries, pointing its link/href at
   "/games/pong-online". Paste that file back to me if you'd rather I
   give you an exact line-by-line diff instead of doing this by hand.

4. git add -A
   git commit -m "Add online multiplayer Pong with room-code lobbies"
   git push

5. Test with a friend (or two browser windows, two different
   accounts): one creates a lobby, the other joins with the code,
   match should start within ~1.5 seconds of both being in.

Known limits, stated up front
------------------------------------------------------------
- No spectators, no public lobby browser (private room code only,
  matching how Shadow Crew works).
- No rankings/stats/rewards - just a match, a winner, a rematch
  button.
- Keyboard only (no touch controls) for this first pass.
- I can't personally test live cross-browser Realtime sync from this
  sandbox (no live Supabase credentials reachable here) - same
  disclosed limitation as every other realtime feature this session.
  The channel/presence/broadcast code follows the exact pattern
  already proven working in your production Shadow Crew game, but a
  real two-browser test after deploy is still worth doing.
