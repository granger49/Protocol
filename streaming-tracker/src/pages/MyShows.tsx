import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ShowPoster from '../components/ShowPoster'
import { getLibrary, setLibraryStatus } from '../lib/storage'
import { findShowById, SHOWS } from '../data/shows'
import type { WatchStatus } from '../types'

const GROUPS: { key: WatchStatus; label: string }[] = [
  { key: 'watching', label: 'Watching' },
  { key: 'want', label: 'Want to watch' },
  { key: 'finished', label: 'Finished' },
  { key: 'dropped', label: 'Dropped' },
]

export default function MyShows() {
  const [library, setLibrary] = useState(getLibrary())
  const [addOpen, setAddOpen] = useState(false)

  const byStatus = useMemo(() => {
    const map: Record<WatchStatus, typeof library> = { watching: [], want: [], finished: [], dropped: [] }
    for (const entry of library) map[entry.status].push(entry)
    return map
  }, [library])

  function changeStatus(showId: string, status: WatchStatus) {
    setLibrary(setLibraryStatus(showId, status))
  }

  const untracked = SHOWS.filter((s) => !library.some((e) => e.showId === s.id))

  return (
    <>
      <TopBar title="My Shows" />
      <div className="px-4 pt-3 pb-8">
        {library.length === 0 && (
          <p className="text-sm text-white/50 py-6 text-center">
            Nothing tracked yet — capture a show or add one below.
          </p>
        )}

        {GROUPS.map((group) => {
          const entries = byStatus[group.key]
          if (entries.length === 0) return null
          return (
            <div key={group.key} className="mb-6">
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">
                {group.label} · {entries.length}
              </p>
              <div className="flex flex-col gap-2">
                {entries.map((entry) => {
                  const show = findShowById(entry.showId)
                  if (!show) return null
                  return (
                    <div key={entry.showId} className="flex items-center gap-3 rounded-xl border border-line bg-panel p-2.5">
                      <Link to={`/show/${show.slug}`}>
                        <ShowPoster show={show} size="sm" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={`/show/${show.slug}`} className="text-sm font-medium truncate block">
                          {show.title}
                        </Link>
                        <p className="text-xs text-white/40">{show.platforms.join(', ')}</p>
                      </div>
                      <select
                        value={entry.status}
                        onChange={(e) => changeStatus(entry.showId, e.target.value as WatchStatus)}
                        className="bg-white/5 border border-line rounded-full text-xs px-2 py-1.5 outline-none"
                      >
                        {GROUPS.map((g) => (
                          <option key={g.key} value={g.key}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        <button
          onClick={() => setAddOpen((v) => !v)}
          className="w-full rounded-full border border-dashed border-line py-2.5 text-sm text-white/50"
        >
          {addOpen ? 'Hide catalog' : '+ Add a show manually'}
        </button>

        {addOpen && (
          <div className="grid grid-cols-3 gap-2 mt-3 animate-pop">
            {untracked.map((show) => (
              <button
                key={show.id}
                onClick={() => changeStatus(show.id, 'want')}
                className="flex flex-col items-center gap-1"
              >
                <ShowPoster show={show} size="md" />
                <span className="text-[11px] text-white/60 text-center leading-tight line-clamp-2">{show.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
