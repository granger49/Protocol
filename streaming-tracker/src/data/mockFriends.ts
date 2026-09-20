import type { Friend, Post, Review } from '../types'

export const FRIENDS: Friend[] = [
  { id: 'f1', name: 'Priya Shah', handle: 'priyawatches', avatarColor: 'from-rose-500 to-orange-400', bio: 'Prestige drama enjoyer. Currently obsessed with anything A24-adjacent.' },
  { id: 'f2', name: 'Marcus Webb', handle: 'marcusw', avatarColor: 'from-blue-500 to-cyan-400', bio: 'Sci-fi and true crime. Will not shut up about Severance.' },
  { id: 'f3', name: 'Dana Okafor', handle: 'danao', avatarColor: 'from-violet-500 to-fuchsia-400', bio: 'Comfort comedy rewatcher. Ask me about The Bear.' },
  { id: 'f4', name: 'Leo Fontaine', handle: 'leofontaine', avatarColor: 'from-emerald-500 to-teal-400', bio: 'Horror and mystery. Yellowjackets truther.' },
]

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString()

export const FRIEND_POSTS: Post[] = [
  { id: 'p1', authorId: 'f1', showId: 's1', photo: null, caption: 'Episode 6 broke me. The elevator scene lives in my head rent free.', rating: 5, visibility: 'friends', createdAt: hoursAgo(2) },
  { id: 'p2', authorId: 'f2', showId: 's5', photo: null, caption: 'Finally caught up. That was not a video game adaptation, that was just grief.', rating: 5, visibility: 'friends', createdAt: hoursAgo(5) },
  { id: 'p3', authorId: 'f3', showId: 's2', photo: null, caption: 'Rewatching for the fourth time. "Every second counts" hits different at 11pm.', rating: 4, visibility: 'friends', createdAt: hoursAgo(9) },
  { id: 'p4', authorId: 'f4', showId: 's14', photo: null, caption: 'The 90s timeline is unhinged and I respect it fully.', rating: 4, visibility: 'friends', createdAt: hoursAgo(20) },
  { id: 'p5', authorId: 'f1', showId: 's15', photo: null, caption: 'Season 3 casting is so good it should be illegal.', rating: 5, visibility: 'friends', createdAt: hoursAgo(30) },
  { id: 'p6', authorId: 'f2', showId: 's16', photo: null, caption: 'Gary Oldman deserves every award that exists for this.', rating: 4, visibility: 'friends', createdAt: hoursAgo(48) },
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
