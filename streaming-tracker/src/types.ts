export type Platform =
  | 'Netflix'
  | 'Hulu'
  | 'Max'
  | 'Disney+'
  | 'Prime Video'
  | 'Apple TV+'
  | 'Paramount+'
  | 'Peacock'
  | 'FX'
  | 'AMC'

export interface Show {
  id: string
  slug: string
  title: string
  year: number
  genres: string[]
  platforms: Platform[]
  synopsis: string
  color: string // gradient seed for the poster placeholder
  emoji: string
}

export interface Review {
  id: string
  showId: string
  authorId: string
  rating: number // 1-5
  text: string
  createdAt: string
}

export type WatchStatus = 'watching' | 'want' | 'finished' | 'dropped'

export interface LibraryEntry {
  showId: string
  status: WatchStatus
  addedAt: string
}

export type Visibility = 'public' | 'friends' | 'private'

export interface Post {
  id: string
  authorId: string
  showId: string
  photo: string | null // data URL, captured from the TV
  caption: string
  rating: number | null
  visibility: Visibility
  createdAt: string
}

export interface Friend {
  id: string
  name: string
  handle: string
  avatarColor: string
  bio: string
}

export interface User {
  id: string
  name: string
  handle: string
}
