import type { DefaultListKind, ListDef, ListItem, Review, User, Visibility } from '../types'

const KEYS = {
  user: 'reel.user',
  lists: 'reel.lists',
  listItems: 'reel.listItems',
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

export const DEFAULT_LISTS: { kind: DefaultListKind; name: string; visibility: Visibility }[] = [
  { kind: 'watching', name: 'Watching', visibility: 'friends' },
  { kind: 'want', name: 'Want to Watch', visibility: 'friends' },
  { kind: 'finished', name: 'Finished', visibility: 'friends' },
  { kind: 'dropped', name: 'Dropped', visibility: 'private' },
]

export function getLists(): ListDef[] {
  const lists = read<ListDef[]>(KEYS.lists, [])
  if (lists.length === 0) {
    return ensureDefaultLists()
  }
  return lists
}

function ensureDefaultLists(): ListDef[] {
  const user = getUser()
  const lists: ListDef[] = DEFAULT_LISTS.map((d) => ({
    id: uid('list'),
    ownerId: user.id,
    name: d.name,
    kind: d.kind,
    visibility: d.visibility,
    createdAt: new Date().toISOString(),
  }))
  write(KEYS.lists, lists)
  return lists
}

export function createList(name: string, visibility: Visibility) {
  const user = getUser()
  const lists = getLists()
  const list: ListDef = {
    id: uid('list'),
    ownerId: user.id,
    name,
    kind: 'custom',
    visibility,
    createdAt: new Date().toISOString(),
  }
  const next = [...lists, list]
  write(KEYS.lists, next)
  return { lists: next, list }
}

export function updateListVisibility(listId: string, visibility: Visibility) {
  const next = getLists().map((l) => (l.id === listId ? { ...l, visibility } : l))
  write(KEYS.lists, next)
  return next
}

export function renameList(listId: string, name: string) {
  const next = getLists().map((l) => (l.id === listId ? { ...l, name } : l))
  write(KEYS.lists, next)
  return next
}

export function deleteList(listId: string) {
  const nextLists = getLists().filter((l) => l.id !== listId)
  const nextItems = getListItems().filter((i) => i.listId !== listId)
  write(KEYS.lists, nextLists)
  write(KEYS.listItems, nextItems)
  return { lists: nextLists, items: nextItems }
}

export function getListItems(): ListItem[] {
  return read<ListItem[]>(KEYS.listItems, [])
}

export function addToList(
  listId: string,
  showId: string,
  extra: { photo?: string | null; note?: string } = {},
) {
  const items = getListItems()
  // a show only appears once per list
  const filtered = items.filter((i) => !(i.listId === listId && i.showId === showId))
  const item: ListItem = {
    id: uid('item'),
    listId,
    showId,
    photo: extra.photo ?? null,
    note: extra.note ?? '',
    addedAt: new Date().toISOString(),
  }
  const next = [item, ...filtered]
  write(KEYS.listItems, next)
  return next
}

/** Moves a show between the mutually-exclusive default status lists (watching/want/finished/dropped). */
export function moveToDefaultList(showId: string, kind: DefaultListKind, extra?: { photo?: string | null; note?: string }) {
  const lists = getLists()
  const defaultListIds = new Set(lists.filter((l) => l.kind !== 'custom').map((l) => l.id))
  const target = lists.find((l) => l.kind === kind)
  if (!target) return getListItems()

  const items = getListItems().filter((i) => !(defaultListIds.has(i.listId) && i.showId === showId))
  const item: ListItem = {
    id: uid('item'),
    listId: target.id,
    showId,
    photo: extra?.photo ?? null,
    note: extra?.note ?? '',
    addedAt: new Date().toISOString(),
  }
  const next = [item, ...items]
  write(KEYS.listItems, next)
  return next
}

export function removeFromList(listId: string, showId: string) {
  const next = getListItems().filter((i) => !(i.listId === listId && i.showId === showId))
  write(KEYS.listItems, next)
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
      lists: getLists(),
      listItems: getListItems(),
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
  if (data.lists) write(KEYS.lists, data.lists)
  if (data.listItems) write(KEYS.listItems, data.listItems)
  if (data.reviews) write(KEYS.reviews, data.reviews)
}

export function clearAllData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}

export function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
