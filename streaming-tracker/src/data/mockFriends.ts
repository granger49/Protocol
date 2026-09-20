import type { Friend, ListDef, ListItem, Review } from '../types'

export const FRIENDS: Friend[] = [
  { id: 'f1', name: 'Priya Shah', handle: 'priyawatches', avatarColor: 'from-rose-500 to-orange-400', bio: 'Prestige drama enjoyer. Currently obsessed with anything A24-adjacent.' },
  { id: 'f2', name: 'Marcus Webb', handle: 'marcusw', avatarColor: 'from-blue-500 to-cyan-400', bio: 'Sci-fi and true crime. Will not shut up about Severance.' },
  { id: 'f3', name: 'Dana Okafor', handle: 'danao', avatarColor: 'from-violet-500 to-fuchsia-400', bio: 'Comfort comedy rewatcher. Ask me about The Bear.' },
  { id: 'f4', name: 'Leo Fontaine', handle: 'leofontaine', avatarColor: 'from-emerald-500 to-teal-400', bio: 'Horror and mystery. Yellowjackets truther.' },
]

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString()

// Each friend gets the same three default lists (mirroring what a real
// user has) plus one hand-curated custom list, so Friends/FriendProfile
// and the home activity feed have something real to render.
export const FRIEND_LISTS: ListDef[] = [
  { id: 'f1-watching', ownerId: 'f1', name: 'Watching', kind: 'watching', visibility: 'friends', createdAt: hoursAgo(400) },
  { id: 'f1-finished', ownerId: 'f1', name: 'Finished', kind: 'finished', visibility: 'friends', createdAt: hoursAgo(400) },
  { id: 'f1-custom', ownerId: 'f1', name: 'A24-core', kind: 'custom', visibility: 'friends', createdAt: hoursAgo(200) },

  { id: 'f2-watching', ownerId: 'f2', name: 'Watching', kind: 'watching', visibility: 'friends', createdAt: hoursAgo(400) },
  { id: 'f2-finished', ownerId: 'f2', name: 'Finished', kind: 'finished', visibility: 'friends', createdAt: hoursAgo(400) },
  { id: 'f2-custom', ownerId: 'f2', name: 'Puzzle-box shows', kind: 'custom', visibility: 'friends', createdAt: hoursAgo(180) },

  { id: 'f3-watching', ownerId: 'f3', name: 'Watching', kind: 'watching', visibility: 'friends', createdAt: hoursAgo(400) },
  { id: 'f3-want', ownerId: 'f3', name: 'Want to Watch', kind: 'want', visibility: 'friends', createdAt: hoursAgo(400) },
  { id: 'f3-custom', ownerId: 'f3', name: 'Comfort rewatches', kind: 'custom', visibility: 'friends', createdAt: hoursAgo(220) },

  { id: 'f4-watching', ownerId: 'f4', name: 'Watching', kind: 'watching', visibility: 'friends', createdAt: hoursAgo(400) },
  { id: 'f4-finished', ownerId: 'f4', name: 'Finished', kind: 'finished', visibility: 'friends', createdAt: hoursAgo(400) },
  { id: 'f4-custom', ownerId: 'f4', name: 'Horror & mystery', kind: 'custom', visibility: 'friends', createdAt: hoursAgo(160) },
]

export const FRIEND_LIST_ITEMS: ListItem[] = [
  { id: 'fi1', listId: 'f1-watching', showId: 's1', photo: null, note: 'Episode 6 broke me. The elevator scene lives in my head rent free.', addedAt: hoursAgo(2) },
  { id: 'fi2', listId: 'f1-finished', showId: 's15', photo: null, note: 'Season 3 casting is so good it should be illegal.', addedAt: hoursAgo(30) },
  { id: 'fi3', listId: 'f1-custom', showId: 's6', photo: null, note: '', addedAt: hoursAgo(150) },
  { id: 'fi4', listId: 'f1-custom', showId: 's3', photo: null, note: '', addedAt: hoursAgo(151) },

  { id: 'fi5', listId: 'f2-watching', showId: 's5', photo: null, note: 'Finally caught up. That was not a video game adaptation, that was just grief.', addedAt: hoursAgo(5) },
  { id: 'fi6', listId: 'f2-finished', showId: 's16', photo: null, note: 'Gary Oldman deserves every award that exists for this.', addedAt: hoursAgo(48) },
  { id: 'fi7', listId: 'f2-custom', showId: 's1', photo: null, note: '', addedAt: hoursAgo(130) },

  { id: 'fi8', listId: 'f3-watching', showId: 's2', photo: null, note: 'Rewatching for the fourth time. "Every second counts" hits different at 11pm.', addedAt: hoursAgo(9) },
  { id: 'fi9', listId: 'f3-want', showId: 's19', photo: null, note: '', addedAt: hoursAgo(60) },
  { id: 'fi10', listId: 'f3-custom', showId: 's9', photo: null, note: '', addedAt: hoursAgo(190) },
  { id: 'fi11', listId: 'f3-custom', showId: 's7', photo: null, note: '', addedAt: hoursAgo(191) },

  { id: 'fi12', listId: 'f4-watching', showId: 's14', photo: null, note: 'The 90s timeline is unhinged and I respect it fully.', addedAt: hoursAgo(20) },
  { id: 'fi13', listId: 'f4-finished', showId: 's24', photo: null, note: '', addedAt: hoursAgo(80) },
  { id: 'fi14', listId: 'f4-custom', showId: 's14', photo: null, note: '', addedAt: hoursAgo(140) },
]

export const FRIEND_REVIEWS: Review[] = [
  { id: 'r1', showId: 's1', authorId: 'f1', rating: 5, text: 'Best cold open of any show in the last decade. Unsettling in the best way.', createdAt: hoursAgo(3) },
  { id: 'r2', showId: 's2', authorId: 'f3', rating: 5, text: 'The kitchen chaos is filmed like a horror movie and I mean that as a compliment.', createdAt: hoursAgo(11) },
  { id: 'r3', showId: 's5', authorId: 'f2', rating: 5, text: 'Episode 3 is basically a standalone film. Devastating.', createdAt: hoursAgo(6) },
  { id: 'r4', showId: 's7', authorId: 'f3', rating: 4, text: 'Started as a joke premise, ended as genuine comfort watching.', createdAt: hoursAgo(60) },
  { id: 'r5', showId: 's14', authorId: 'f4', rating: 4, text: 'Somehow both a survival thriller and a workplace-drama-in-the-woods.', createdAt: hoursAgo(22) },
]

export function friendById(id: string) {
  return FRIENDS.find((f) => f.id === id)
}

export function listsForFriend(friendId: string) {
  return FRIEND_LISTS.filter((l) => l.ownerId === friendId && l.visibility !== 'private')
}

export function itemsForList(listId: string) {
  return FRIEND_LIST_ITEMS.filter((i) => i.listId === listId).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  )
}
