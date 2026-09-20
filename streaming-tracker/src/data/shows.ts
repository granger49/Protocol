import type { Show } from '../types'

// Local seed catalog. In production this step is replaced by a real
// title-recognition API (see src/lib/recognize.ts) backed by a proper
// metadata + "where to watch" provider (e.g. TMDB + JustWatch/Watchmode).
export const SHOWS: Show[] = [
  { id: 's1', slug: 'severance', title: 'Severance', year: 2022, genres: ['Sci-Fi', 'Thriller'], platforms: ['Apple TV+'], synopsis: 'Employees undergo a procedure to split their memories between work and home.', color: 'from-indigo-600 to-cyan-500', emoji: '🧠' },
  { id: 's2', slug: 'the-bear', title: 'The Bear', year: 2022, genres: ['Drama', 'Comedy'], platforms: ['Hulu'], synopsis: 'A young chef returns home to run his late brother\'s sandwich shop.', color: 'from-orange-600 to-red-500', emoji: '🍞' },
  { id: 's3', slug: 'succession', title: 'Succession', year: 2018, genres: ['Drama'], platforms: ['Max'], synopsis: 'A media dynasty fights over who will take control of the family empire.', color: 'from-slate-700 to-zinc-500', emoji: '👑' },
  { id: 's4', slug: 'stranger-things', title: 'Stranger Things', year: 2016, genres: ['Sci-Fi', 'Horror'], platforms: ['Netflix'], synopsis: 'Kids in a small town uncover supernatural forces and secret experiments.', color: 'from-red-700 to-purple-700', emoji: '📼' },
  { id: 's5', slug: 'the-last-of-us', title: 'The Last of Us', year: 2023, genres: ['Drama', 'Horror'], platforms: ['Max'], synopsis: 'A smuggler escorts a girl across a post-pandemic United States.', color: 'from-emerald-700 to-lime-600', emoji: '🍄' },
  { id: 's6', slug: 'fleabag', title: 'Fleabag', year: 2016, genres: ['Comedy', 'Drama'], platforms: ['Prime Video'], synopsis: 'A woman navigates modern life in London while breaking the fourth wall.', color: 'from-pink-600 to-rose-500', emoji: '🍷' },
  { id: 's7', slug: 'ted-lasso', title: 'Ted Lasso', year: 2020, genres: ['Comedy', 'Sport'], platforms: ['Apple TV+'], synopsis: 'An American football coach takes over an English football club.', color: 'from-yellow-500 to-amber-600', emoji: '⚽' },
  { id: 's8', slug: 'the-crown', title: 'The Crown', year: 2016, genres: ['Drama', 'History'], platforms: ['Netflix'], synopsis: 'The reign of Queen Elizabeth II, from the 1940s to modern times.', color: 'from-yellow-700 to-stone-500', emoji: '👑' },
  { id: 's9', slug: 'abbott-elementary', title: 'Abbott Elementary', year: 2021, genres: ['Comedy'], platforms: ['Hulu'], synopsis: 'A mockumentary about teachers at an underfunded Philadelphia school.', color: 'from-sky-600 to-blue-500', emoji: '🏫' },
  { id: 's10', slug: 'house-of-the-dragon', title: 'House of the Dragon', year: 2022, genres: ['Fantasy', 'Drama'], platforms: ['Max'], synopsis: 'The Targaryen civil war, two hundred years before Game of Thrones.', color: 'from-red-800 to-black', emoji: '🐉' },
  { id: 's11', slug: 'only-murders-in-the-building', title: 'Only Murders in the Building', year: 2021, genres: ['Comedy', 'Mystery'], platforms: ['Hulu'], synopsis: 'Three strangers obsessed with true crime investigate a death in their building.', color: 'from-purple-700 to-fuchsia-600', emoji: '🔎' },
  { id: 's12', slug: 'the-mandalorian', title: 'The Mandalorian', year: 2019, genres: ['Sci-Fi', 'Action'], platforms: ['Disney+'], synopsis: 'A lone bounty hunter makes his way through the outer reaches of the galaxy.', color: 'from-neutral-700 to-slate-600', emoji: '🪐' },
  { id: 's13', slug: 'reservation-dogs', title: 'Reservation Dogs', year: 2021, genres: ['Comedy', 'Drama'], platforms: ['Hulu'], synopsis: 'Four Indigenous teens in rural Oklahoma navigate life and loss.', color: 'from-orange-700 to-yellow-600', emoji: '🌵' },
  { id: 's14', slug: 'yellowjackets', title: 'Yellowjackets', year: 2021, genres: ['Horror', 'Mystery'], platforms: ['Paramount+'], synopsis: 'A girls\' soccer team survives a plane crash in the wilderness — with consequences.', color: 'from-yellow-600 to-green-700', emoji: '🏕️' },
  { id: 's15', slug: 'the-white-lotus', title: 'The White Lotus', year: 2021, genres: ['Drama', 'Satire'], platforms: ['Max'], synopsis: 'Guests and staff at a luxury resort unravel over the course of a week.', color: 'from-teal-600 to-emerald-500', emoji: '🌺' },
  { id: 's16', slug: 'slow-horses', title: 'Slow Horses', year: 2022, genres: ['Spy', 'Thriller'], platforms: ['Apple TV+'], synopsis: 'MI5 rejects investigate a case from the bottom rung of the service.', color: 'from-gray-700 to-blue-900', emoji: '🐎' },
  { id: 's17', slug: 'atlanta', title: 'Atlanta', year: 2016, genres: ['Comedy', 'Surreal'], platforms: ['Hulu'], synopsis: 'Two cousins navigate the Atlanta rap scene and everyday absurdity.', color: 'from-violet-700 to-indigo-600', emoji: '🎤' },
  { id: 's18', slug: 'poker-face', title: 'Poker Face', year: 2023, genres: ['Mystery', 'Comedy'], platforms: ['Peacock'], synopsis: 'A woman with a natural lie-detecting ability solves a new mystery each week.', color: 'from-red-600 to-yellow-500', emoji: '🃏' },
  { id: 's19', slug: 'shogun', title: 'Shōgun', year: 2024, genres: ['Drama', 'History'], platforms: ['Hulu', 'FX'], synopsis: 'A shipwrecked English sailor gets caught up in feudal Japan\'s power struggle.', color: 'from-red-900 to-stone-700', emoji: '⚔️' },
  { id: 's20', slug: 'better-call-saul', title: 'Better Call Saul', year: 2015, genres: ['Crime', 'Drama'], platforms: ['AMC', 'Netflix'], synopsis: 'The transformation of a small-time lawyer into the man known as Saul Goodman.', color: 'from-amber-600 to-orange-700', emoji: '⚖️' },
  { id: 's21', slug: 'the-boys', title: 'The Boys', year: 2019, genres: ['Superhero', 'Satire'], platforms: ['Prime Video'], synopsis: 'Vigilantes take on corrupt superheroes secretly controlled by a corporation.', color: 'from-red-600 to-blue-800', emoji: '🦸' },
  { id: 's22', slug: 'loki', title: 'Loki', year: 2021, genres: ['Sci-Fi', 'Fantasy'], platforms: ['Disney+'], synopsis: 'The God of Mischief is recruited by a mysterious bureaucratic organization.', color: 'from-emerald-700 to-green-500', emoji: '🐍' },
  { id: 's23', slug: 'girls5eva', title: 'Girls5eva', year: 2021, genres: ['Comedy', 'Musical'], platforms: ['Netflix'], synopsis: 'A one-hit-wonder girl group gets a shot at a comeback.', color: 'from-pink-500 to-purple-500', emoji: '🎶' },
  { id: 's24', slug: 'true-detective', title: 'True Detective', year: 2014, genres: ['Crime', 'Anthology'], platforms: ['Max'], synopsis: 'An anthology series following detectives entangled in dark, layered investigations.', color: 'from-slate-800 to-cyan-800', emoji: '🔦' },
]

export function findShowBySlug(slug: string) {
  return SHOWS.find((s) => s.slug === slug)
}

export function findShowById(id: string) {
  return SHOWS.find((s) => s.id === id)
}
