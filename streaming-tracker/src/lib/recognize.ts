import { SHOWS } from '../data/shows'
import type { Show } from '../types'

export interface RecognitionCandidate {
  show: Show
  confidence: number
}

/**
 * Simulated "point your phone at the TV" recognition.
 *
 * There's no on-device vision model here, so this stands in for one: it
 * hashes the captured photo's bytes into a deterministic seed and returns a
 * plausible ranked shortlist, the same shape a real recognizer would return.
 *
 * Swap this out for a real call (e.g. a vision-capable model given the
 * frame, or a TV/movie recognition API) — the rest of the capture flow
 * (RecognitionResults, confirm, post) doesn't need to change.
 */
export async function recognizeFromPhoto(dataUrl: string): Promise<RecognitionCandidate[]> {
  await delay(900 + Math.random() * 700)

  const seed = hashString(dataUrl.slice(-2000))
  const rand = mulberry32(seed)

  const shuffled = [...SHOWS].sort(() => rand() - 0.5)
  const top = shuffled.slice(0, 3)

  const confidences = [0.7 + rand() * 0.25, 0.35 + rand() * 0.25, 0.15 + rand() * 0.15].sort((a, b) => b - a)

  return top.map((show, i) => ({ show, confidence: Math.min(0.98, confidences[i]) }))
}

export function searchShows(query: string): Show[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return SHOWS.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.genres.some((g) => g.toLowerCase().includes(q)) ||
      s.platforms.some((p) => p.toLowerCase().includes(q)),
  ).slice(0, 8)
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash >>> 0
}

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
