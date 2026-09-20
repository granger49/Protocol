# Reel — streaming show tracker (local prototype)

A local-first prototype for tracking and sharing what you're streaming. Point
your phone at the TV, the app identifies the show, and you add it to one of
your lists — Watching, Want to Watch, Finished, or any custom list you make —
with reviews, friends' lists you can browse, and a QR code that promotes the
app to whoever scans it.

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
- **Friends & their lists/reviews** (`src/data/mockFriends.ts`): seeded so
  the home activity feed and friends' lists feel alive without a backend or
  auth.
- **QR code** (`src/lib/qr.ts`): fully real — generates a scannable code
  pointing at `/s/:slug`, a standalone landing page (no app chrome) showing
  the show, community reviews, and app-store style download buttons. This is
  what a friend would land on after scanning a code you share.
- **Persistence**: your lists, the shows in them, and your reviews are saved
  to `localStorage` (see `src/lib/storage.ts`) and export/import as JSON from
  the Profile tab, so you can carry a demo state between sessions or devices.

## The list model

Every user starts with four default lists — **Watching**, **Want to Watch**,
**Finished**, **Dropped** — that a show can only be in one of at a time (like
a status). On top of that, you can create any number of **custom lists**
(e.g. "Oscar contenders", "Date night") that a show can belong to alongside
its status, with no exclusivity. Every list — default or custom — has its
own visibility: public, friends, or only me. That's the control point: you
decide who can see a given list, not per-item.

## Where things live

```
src/
  data/          seed catalog + mock friends/social data
  lib/           storage, simulated recognition, QR generation
  components/    ShowPoster, StarRating, ActivityRow, PhotoCapture, ...
  pages/
    Home.tsx              your lists overview + friends' list activity
    Capture.tsx            photo -> recognize -> confirm -> add to a list
    Lists.tsx               manage your lists, create custom ones
    ListDetail.tsx          one list's shows, visibility, rename/delete
    ShowDetail.tsx          show info, reviews, which lists it's in, QR share
    Friends.tsx / FriendProfile.tsx / FriendListDetail.tsx
    Profile.tsx             account, data export/import
    PublicShow.tsx          the page the QR code links to (/s/:slug)
```

## Next steps toward a real product

1. Replace `recognizeFromPhoto` with a real vision call.
2. Replace the local catalog with a metadata API (TMDB) + availability API.
3. Add real accounts/auth and move storage to a backend so lists/friends
   sync across devices — the `storage.ts` interface is already shaped for
   a drop-in swap (same function signatures, async-ready).
4. Real friend graph (requests, follow/unfollow) instead of seeded friends.
5. Native camera + share-sheet integration if this becomes a native or PWA
   app, so the capture flow is one tap from the home screen.
