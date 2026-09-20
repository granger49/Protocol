import { Link } from 'react-router-dom'
import type { ListDef, ListItem } from '../types'
import { findShowById } from '../data/shows'

const VISIBILITY_LABEL: Record<ListDef['visibility'], string> = {
  public: '🌐 Public',
  friends: '👥 Friends',
  private: '🔒 Only me',
}

export default function ListSummaryCard({
  list,
  items,
  to,
}: {
  list: ListDef
  items: ListItem[]
  to: string
}) {
  const posters = items
    .slice(0, 4)
    .map((i) => findShowById(i.showId))
    .filter(Boolean)

  return (
    <Link to={to} className="block rounded-xl2 border border-line bg-panel p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">{list.name}</p>
        <span className="text-[11px] text-white/40">{VISIBILITY_LABEL[list.visibility]}</span>
      </div>
      {posters.length > 0 ? (
        <div className="flex -space-x-3">
          {posters.map((show) => (
            <span
              key={show!.id}
              className={`h-12 w-9 rounded-md bg-gradient-to-br ${show!.color} flex items-center justify-center text-sm ring-2 ring-panel`}
            >
              {show!.emoji}
            </span>
          ))}
          {items.length > 4 && (
            <span className="h-12 w-9 rounded-md bg-white/5 ring-2 ring-panel flex items-center justify-center text-[11px] text-white/50">
              +{items.length - 4}
            </span>
          )}
        </div>
      ) : (
        <p className="text-xs text-white/30">Empty</p>
      )}
      <p className="text-xs text-white/40 mt-2">
        {items.length} show{items.length === 1 ? '' : 's'}
      </p>
    </Link>
  )
}
