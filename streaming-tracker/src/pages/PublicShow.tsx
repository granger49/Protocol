import { useParams, Link } from 'react-router-dom'
import { findShowBySlug } from '../data/shows'
import { FRIEND_REVIEWS } from '../data/mockFriends'
import ShowPoster from '../components/ShowPoster'
import PlatformBadge from '../components/PlatformBadge'
import StarRating from '../components/StarRating'

export default function PublicShow() {
  const { slug } = useParams()
  const show = slug ? findShowBySlug(slug) : undefined

  if (!show) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-4xl mb-3">🎬</p>
        <p className="text-white/60 text-sm">This show isn't in the demo catalog.</p>
      </div>
    )
  }

  const reviews = FRIEND_REVIEWS.filter((r) => r.showId === show.id)
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-5 py-4 flex items-center gap-2">
        <span className="text-xl">🎬</span>
        <span className="font-display font-semibold">Reel</span>
      </header>

      <main className="flex-1 px-5 pb-10 flex flex-col items-center text-center">
        <ShowPoster show={show} size="lg" />
        <h1 className="font-display font-semibold text-2xl mt-5">{show.title}</h1>
        <p className="text-sm text-white/40 mt-1">
          {show.year} · {show.genres.join(', ')}
        </p>

        <div className="flex flex-wrap gap-1.5 justify-center mt-3">
          {show.platforms.map((p) => (
            <PlatformBadge key={p} platform={p} />
          ))}
        </div>

        {avg != null && (
          <div className="flex items-center gap-2 mt-3">
            <StarRating value={Math.round(avg)} readOnly />
            <span className="text-sm text-white/50">
              {avg.toFixed(1)} from your friends on Reel
            </span>
          </div>
        )}

        <p className="text-sm text-white/70 leading-relaxed mt-5 max-w-sm">{show.synopsis}</p>

        <div className="w-full max-w-sm mt-8 rounded-xl2 border border-line bg-panel p-5">
          <p className="font-display font-semibold mb-1">See what your friends think</p>
          <p className="text-xs text-white/50 mb-4">
            Get Reel to read full reviews, track what you're watching, and share your own posts.
          </p>
          <div className="flex flex-col gap-2">
            <button className="rounded-full bg-white text-ink text-sm font-semibold py-2.5">
              Get it on the App Store
            </button>
            <button className="rounded-full border border-line text-sm font-semibold py-2.5">
              Get it on Google Play
            </button>
          </div>
          <Link to="/" className="block text-xs text-accent2 mt-3">
            Already have Reel? Open the app →
          </Link>
        </div>

        {reviews.length > 0 && (
          <div className="w-full max-w-sm mt-6 flex flex-col gap-2 text-left">
            <p className="text-xs uppercase tracking-wide text-white/40">From the Reel community</p>
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-xl border border-line bg-panel p-3">
                <StarRating value={r.rating} readOnly size="sm" />
                <p className="text-sm text-white/70 mt-1">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
