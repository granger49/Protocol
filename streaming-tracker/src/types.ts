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

export type Visibility = 'public' | 'friends' | 'private'

// The four default lists every user starts with. Users can also create
// their own custom lists ('custom') alongside these.
export type DefaultListKind = 'watching' | 'want' | 'finished' | 'dropped'
export type ListKind = DefaultListKind | 'custom'

export interface ListDef {
  id: string
  ownerId: string
  name: string
  kind: ListKind
  visibility: Visibility
  createdAt: string
}

export interface ListItem {
  id: string
  listId: string
  showId: string
  photo: string | null // data URL, captured from the TV
  note: string
  addedAt: string
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
