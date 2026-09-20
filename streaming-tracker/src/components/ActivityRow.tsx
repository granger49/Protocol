import { Link } from 'react-router-dom'
import type { ListItem } from '../types'
import { findShowById } from '../data/shows'
import ShowPoster from './ShowPoster'
import PlatformBadge from './PlatformBadge'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hrs = Math.floor(diff / 3600_000)
  if (hrs < 1) return 'just now'
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function ActivityRow({
  item,
  authorName,
  authorColor,
  listName,
  onRemove,
}: {
  item: ListItem
  authorName: string
  authorColor: string
  listName: string
  onRemove?: () => void
}) {
  const show = findShowById(item.showId)
  if (!show) return null

  return (
    <article className="animate-pop rounded-xl2 border border-line bg-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-8 w-8 rounded-full bg-gradient-to-br ${authorColor} flex-shrink-0`} />
        <div className="min-w-0">
          <p className="text-sm">
            <span className="font-medium">{authorName}</span>{' '}
            <span className="text-white/50">added to</span> <span className="font-medium">{listName}</span>
          </p>
          <p className="text-xs text-white/40">{timeAgo(item.addedAt)}</p>
        </div>
        {onRemove && (
          <button onClick={onRemove} className="ml-auto text-white/30 hover:text-white/70 text-sm px-1">
            ✕
          </button>
        )}
      </div>

      {item.photo ? (
        <img src={item.photo} alt={show.title} className="w-full aspect-video object-cover rounded-lg mb-3" />
      ) : null}

      <div className="flex gap-3">
        <Link to={`/show/${show.slug}`}>
          <ShowPoster show={show} size="sm" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/show/${show.slug}`} className="font-display font-semibold text-sm hover:text-accent transition-colors">
            {show.title}
          </Link>
          <div className="flex flex-wrap gap-1 mt-1">
            {show.platforms.map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>
        </div>
      </div>

      {item.note && <p className="text-sm text-white/80 mt-3 leading-relaxed">{item.note}</p>}
    </article>
  )
}
