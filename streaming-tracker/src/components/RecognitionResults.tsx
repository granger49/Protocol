import { useState } from 'react'
import type { RecognitionCandidate } from '../lib/recognize'
import { searchShows } from '../lib/recognize'
import type { Show } from '../types'
import ShowPoster from './ShowPoster'
import PlatformBadge from './PlatformBadge'

export default function RecognitionResults({
  candidates,
  onSelect,
  onRetake,
}: {
  candidates: RecognitionCandidate[]
  onSelect: (show: Show) => void
  onRetake: () => void
}) {
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const results = searchShows(query)
  const top = candidates[0]

  return (
    <div className="flex flex-col gap-4">
      {top && (
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Best match</p>
          <button
            onClick={() => onSelect(top.show)}
            className="w-full flex items-center gap-3 rounded-xl2 border border-accent/40 bg-accent/10 p-3 text-left animate-pop"
          >
            <ShowPoster show={top.show} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold">{top.show.title}</p>
              <p className="text-xs text-white/50">{top.show.year}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {top.show.platforms.map((p) => (
                  <PlatformBadge key={p} platform={p} />
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-semibold text-accent">{Math.round(top.confidence * 100)}%</p>
              <p className="text-[10px] text-white/40">match</p>
            </div>
          </button>
        </div>
      )}

      {candidates.length > 1 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Other possibilities</p>
          <div className="flex flex-col gap-2">
            {candidates.slice(1).map((c) => (
              <button
                key={c.show.id}
                onClick={() => onSelect(c.show)}
                className="flex items-center gap-3 rounded-xl border border-line bg-panel p-2.5 text-left"
              >
                <ShowPoster show={c.show} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{c.show.title}</p>
                  <p className="text-xs text-white/40">{c.show.year}</p>
                </div>
                <p className="text-sm text-white/40 flex-shrink-0">{Math.round(c.confidence * 100)}%</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-1">
        <button
          onClick={onRetake}
          className="flex-1 rounded-full border border-line py-2.5 text-sm font-medium text-white/70"
        >
          Retake photo
        </button>
        <button
          onClick={() => setShowSearch((v) => !v)}
          className="flex-1 rounded-full border border-line py-2.5 text-sm font-medium text-white/70"
        >
          Not it? Search
        </button>
      </div>

      {showSearch && (
        <div className="animate-pop">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, genre, or platform"
            className="w-full rounded-full bg-white/5 border border-line px-4 py-2.5 text-sm outline-none focus:border-accent2/50"
          />
          {results.length > 0 && (
            <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto">
              {results.map((show) => (
                <button
                  key={show.id}
                  onClick={() => onSelect(show)}
                  className="flex items-center gap-3 rounded-xl border border-line bg-panel p-2.5 text-left"
                >
                  <ShowPoster show={show} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{show.title}</p>
                    <p className="text-xs text-white/40">{show.platforms.join(', ')}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
