# Shadow Link

This build has no backend at all — no database, no auth, no API calls.
Every user, message, balance, and stream shown (`src/lib/appData.ts`) is
fixed static content baked in at build time. Nothing is ever sent over
the network and nothing is stored anywhere; refreshing shows the exact
same content every time.

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
   git commit -m "Shadow Link"
   git branch -M main
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```

3. In Vercel, "Add New Project" → import that repository → deploy.
   Framework preset auto-detects as Next.js. That's it.

## What's in here

- `/` — the landing page. Shadowlink and Stream cards navigate to the
  pages below; Gaming/Store/Settings show a small toast on click (there's
  no page behind them in this build).
- `/chat` — a chatroom view seeded with a few messages. Typing and
  sending actually works - it appends to the in-memory message list -
  but nothing is saved; a refresh resets it back to the seed messages.
- `/directory` — the user directory (fixed users/balances/online
  status).
- `/streams` — the live-streams browse grid (fixed stream cards, no real
  video).
- `src/components/AppShell.tsx` — the sidebar shown on Chat/Directory/
  Streams.
- `src/lib/appData.ts` — every static value used across the site, in one
  place.
