import { Link } from 'react-router-dom'
import type { Post } from '../types'
import { findShowById } from '../data/shows'
import ShowPoster from './ShowPoster'
import StarRating from './StarRating'
import PlatformBadge from './PlatformBadge'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hrs = Math.floor(diff / 3600_000)
  if (hrs < 1) return 'just now'
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const VISIBILITY_LABEL: Record<Post['visibility'], string> = {
  public: '🌐 Public',
  friends: '👥 Friends',
  private: '🔒 Only me',
}

export default function PostCard({
  post,
  authorName,
  authorColor,
  onDelete,
}: {
  post: Post
  authorName: string
  authorColor: string
  onDelete?: () => void
}) {
  const show = findShowById(post.showId)
  if (!show) return null

  return (
    <article className="animate-pop rounded-xl2 border border-line bg-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-8 w-8 rounded-full bg-gradient-to-br ${authorColor} flex-shrink-0`} />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{authorName}</p>
          <p className="text-xs text-white/40">
            {timeAgo(post.createdAt)} · {VISIBILITY_LABEL[post.visibility]}
          </p>
        </div>
        {onDelete && (
          <button onClick={onDelete} className="ml-auto text-white/30 hover:text-white/70 text-sm px-1">
            ✕
          </button>
        )}
      </div>

      {post.photo ? (
        <img src={post.photo} alt={show.title} className="w-full aspect-video object-cover rounded-lg mb-3" />
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
          {post.rating != null && <StarRating value={post.rating} readOnly size="sm" />}
        </div>
      </div>

      {post.caption && <p className="text-sm text-white/80 mt-3 leading-relaxed">{post.caption}</p>}
    </article>
  )
}
