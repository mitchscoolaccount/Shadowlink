# ShadowLink — UI Preview

A no-backend visual preview of the ShadowLink app: the ShadowHub landing
page, Chat, Directory, and Streams. Every user, message, balance, and
stream on this site is fabricated and hardcoded (see `src/lib/fakeData.ts`)
— there is no database, no auth, no API calls, and nothing is ever sent
over the network. Nothing is stored anywhere; refreshing shows the exact
same fixed content every time.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel (standalone, own project)

Fully self-contained — no environment variables, no secrets, nothing to
configure.

1. Create a new, empty GitHub repository (on whichever account you want
   this to live under).
2. Push this folder's contents to it:

   ```
   git init
   git add -A
   git commit -m "ShadowLink UI preview"
   git branch -M main
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```

3. In Vercel, "Add New Project" → import that repository → deploy.
   Framework preset auto-detects as Next.js. That's it.

## What's in here

- `/` — ShadowHub landing page. Two cards work (Shadowlink → Chat,
  Stream → Streams); Gaming/Store/Settings are visually present but
  inert, marked "not in preview" / "coming soon".
- `/chat` — a static chatroom view with fabricated messages. The message
  input is present but disabled (preview only).
- `/directory` — the user directory with fabricated users/balances/
  online status.
- `/streams` — the live-streams browse grid with fabricated stream
  cards (no real video).
- `src/components/DemoShell.tsx` — the sidebar shown on Chat/Directory/
  Streams, styled like the real app's nav.
- `src/lib/fakeData.ts` — every fabricated value used across the site,
  in one place.

Nothing here reads or writes to any database, calls any API, or
persists anything — it's UI only.
