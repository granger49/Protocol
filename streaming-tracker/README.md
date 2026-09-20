# Reel — streaming show tracker (local prototype)

A local-first prototype for tracking and sharing what you're streaming. Point
your phone at the TV, the app identifies the show, and you post about it —
with reviews, a friends feed, and a QR code that promotes the app to whoever
scans it.

This build has no backend and no accounts. Everything is stored in your
browser's `localStorage`, so it's meant for working out the UX before wiring
up real infrastructure.

## Run it

```bash
cd streaming-tracker
npm install
npm run dev
```

Open the URL Vite prints. To test the camera capture flow on your phone,
make sure your phone and computer are on the same Wi-Fi, then open the
"Network" URL Vite prints (something like `http://192.168.x.x:5173`) in your
phone's browser — camera access needs either `localhost` or HTTPS, both of
which the LAN URL satisfies over plain HTTP only on `localhost`. If your
phone won't grant camera access over `http://<lan-ip>`, use the in-app
"upload from gallery" fallback, or tunnel with something like `ngrok` for a
real HTTPS URL.

## What's real vs. simulated

- **Show recognition** (`src/lib/recognize.ts`): there's no vision model
  wired in, so a captured photo resolves to a deterministic, plausible
  shortlist from a small local catalog (`src/data/shows.ts`), the same shape
  a real recognizer would return (ranked candidates + confidence). Swap this
  function for a real call — a vision-capable model given the frame, or a
  dedicated TV/movie recognition API — and nothing else in the capture flow
  needs to change.
- **"Where to watch"**: hardcoded per show in the catalog. A real build would
  pull this from a live availability API (e.g. JustWatch/Watchmode) since
  it changes by region and licensing deal.
- **Friends & their posts/reviews** (`src/data/mockFriends.ts`): seeded so
  the feed and friends list feel alive without a backend or auth.
- **QR code** (`src/lib/qr.ts`): fully real — generates a scannable code
  pointing at `/s/:slug`, a standalone landing page (no app chrome) showing
  the show, community reviews, and app-store style download buttons. This is
  what a friend would land on after scanning a code you share.
- **Persistence**: your own posts, library, and reviews are saved to
  `localStorage` (see `src/lib/storage.ts`) and export/import as JSON from
  the Profile tab, so you can carry a demo state between sessions or devices.

## Where things live

```
src/
  data/          seed catalog + mock friends/social data
  lib/           storage, simulated recognition, QR generation
  components/    ShowPoster, StarRating, PostCard, PhotoCapture, ...
  pages/
    Feed.tsx         combined feed (yours + friends)
    Capture.tsx       photo -> recognize -> confirm -> post
    MyShows.tsx       your library, grouped by watch status
    ShowDetail.tsx    show info, reviews, QR share
    Friends.tsx / FriendProfile.tsx
    Profile.tsx       account, data export/import
    PublicShow.tsx    the page the QR code links to (/s/:slug)
```

## Next steps toward a real product

1. Replace `recognizeFromPhoto` with a real vision call.
2. Replace the local catalog with a metadata API (TMDB) + availability API.
3. Add real accounts/auth and move storage to a backend so posts/friends
   sync across devices — the `storage.ts` interface is already shaped for
   a drop-in swap (same function signatures, async-ready).
4. Real friend graph (requests, follow/unfollow) instead of seeded friends.
5. Native camera + share-sheet integration if this becomes a native or PWA
   app, so the capture flow is one tap from the home screen.
