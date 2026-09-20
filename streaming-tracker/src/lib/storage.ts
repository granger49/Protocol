import type { LibraryEntry, Post, Review, User, WatchStatus } from '../types'

const KEYS = {
  user: 'reel.user',
  posts: 'reel.posts',
  library: 'reel.library',
  reviews: 'reel.reviews',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable (private browsing) — fail silently, UX still works in-memory for the session
  }
}

export function getUser(): User {
  return read<User>(KEYS.user, { id: 'me', name: 'You', handle: 'you' })
}

export function saveUser(user: User) {
  write(KEYS.user, user)
}

export function getPosts(): Post[] {
  return read<Post[]>(KEYS.posts, [])
}

export function addPost(post: Post) {
  const posts = getPosts()
  posts.unshift(post)
  write(KEYS.posts, posts)
  return posts
}

export function updatePost(id: string, patch: Partial<Post>) {
  const posts = getPosts().map((p) => (p.id === id ? { ...p, ...patch } : p))
  write(KEYS.posts, posts)
  return posts
}

export function deletePost(id: string) {
  const posts = getPosts().filter((p) => p.id !== id)
  write(KEYS.posts, posts)
  return posts
}

export function getLibrary(): LibraryEntry[] {
  return read<LibraryEntry[]>(KEYS.library, [])
}

export function setLibraryStatus(showId: string, status: WatchStatus) {
  const lib = getLibrary()
  const existing = lib.find((e) => e.showId === showId)
  let next: LibraryEntry[]
  if (existing) {
    next = lib.map((e) => (e.showId === showId ? { ...e, status } : e))
  } else {
    next = [...lib, { showId, status, addedAt: new Date().toISOString() }]
  }
  write(KEYS.library, next)
  return next
}

export function removeFromLibrary(showId: string) {
  const next = getLibrary().filter((e) => e.showId !== showId)
  write(KEYS.library, next)
  return next
}

export function getReviews(): Review[] {
  return read<Review[]>(KEYS.reviews, [])
}

export function addReview(review: Review) {
  const reviews = getReviews().filter((r) => !(r.showId === review.showId && r.authorId === review.authorId))
  reviews.unshift(review)
  write(KEYS.reviews, reviews)
  return reviews
}

export function exportData() {
  return JSON.stringify(
    {
      user: getUser(),
      posts: getPosts(),
      library: getLibrary(),
      reviews: getReviews(),
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  )
}

export function importData(json: string) {
  const data = JSON.parse(json)
  if (data.user) write(KEYS.user, data.user)
  if (data.posts) write(KEYS.posts, data.posts)
  if (data.library) write(KEYS.library, data.library)
  if (data.reviews) write(KEYS.reviews, data.reviews)
}

export function clearAllData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}

export function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
