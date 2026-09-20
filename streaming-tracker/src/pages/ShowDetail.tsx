import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ShowPoster from '../components/ShowPoster'
import PlatformBadge from '../components/PlatformBadge'
import StarRating from '../components/StarRating'
import QRCodeModal from '../components/QRCodeModal'
import { findShowBySlug } from '../data/shows'
import { FRIEND_REVIEWS, friendById } from '../data/mockFriends'
import { addReview, getLibrary, getReviews, getUser, setLibraryStatus, uid } from '../lib/storage'
import type { WatchStatus } from '../types'

const STATUS_LABELS: Record<WatchStatus, string> = {
  watching: 'Watching',
  want: 'Want to watch',
  finished: 'Finished',
  dropped: 'Dropped',
}

export default function ShowDetail() {
  const { slug } = useParams()
  const show = slug ? findShowBySlug(slug) : undefined
  const user = getUser()

  const [library, setLibrary] = useState(getLibrary())
  const [reviews, setReviews] = useState(getReviews())
  const [showQr, setShowQr] = useState(false)
  const [draftRating, setDraftRating] = useState(0)
  const [draftText, setDraftText] = useState('')

  const myEntry = show ? library.find((e) => e.showId === show.id) : undefined
  const myReview = show ? reviews.find((r) => r.showId === show.id && r.authorId === user.id) : undefined

  const allReviews = useMemo(() => {
    if (!show) return []
    const mine = reviews.filter((r) => r.showId === show.id)
    const friends = FRIEND_REVIEWS.filter((r) => r.showId === show.id)
    return [...mine, ...friends].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [show, reviews])

  const avgRating = useMemo(() => {
    if (allReviews.length === 0) return null
    return allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
  }, [allReviews])

  if (!show) {
    return (
      <>
        <TopBar title="Not found" back="/shows" />
        <p className="px-4 py-8 text-sm text-white/50">That show isn't in the catalog.</p>
      </>
    )
  }

  function setStatus(status: WatchStatus) {
    setLibrary(setLibraryStatus(show!.id, status))
  }

  function submitReview() {
    if (!draftRating) return
    setReviews(
      addReview({
        id: uid('rev'),
        showId: show!.id,
        authorId: user.id,
        rating: draftRating,
        text: draftText,
        createdAt: new Date().toISOString(),
      }),
    )
    setDraftText('')
  }

  return (
    <>
      <TopBar title={show.title} back="/shows" />
      <div className="px-4 pt-4 pb-8">
        <div className="flex gap-4">
          <ShowPoster show={show} size="md" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display font-semibold text-xl leading-tight">{show.title}</h2>
            <p className="text-xs text-white/40 mt-0.5">
              {show.year} · {show.genres.join(', ')}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {show.platforms.map((p) => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
            {avgRating != null && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating value={Math.round(avgRating)} readOnly size="sm" />
                <span className="text-xs text-white/40">
                  {avgRating.toFixed(1)} · {allReviews.length} review{allReviews.length === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed mt-4">{show.synopsis}</p>

        <div className="flex gap-2 mt-4">
          <select
            value={myEntry?.status ?? ''}
            onChange={(e) => setStatus(e.target.value as WatchStatus)}
            className="flex-1 bg-white/5 border border-line rounded-full text-sm px-3 py-2 outline-none"
          >
            <option value="" disabled>
              Add to my shows…
            </option>
            {(Object.keys(STATUS_LABELS) as WatchStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowQr(true)}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm"
          >
            <span>▦</span> Share QR
          </button>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-white/40 mb-2">
            {myReview ? 'Your review' : 'Rate & review'}
          </p>
          <div className="rounded-xl2 border border-line bg-panel p-4">
            <StarRating value={draftRating || myReview?.rating || 0} onChange={setDraftRating} size="lg" />
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder={myReview?.text || 'What did you think?'}
              rows={2}
              className="w-full mt-3 rounded-xl bg-white/5 border border-line px-3 py-2 text-sm outline-none focus:border-accent2/50 resize-none"
            />
            <button
              onClick={submitReview}
              disabled={!draftRating}
              className="mt-3 w-full bg-accent text-white text-sm font-medium py-2 rounded-full disabled:opacity-30"
            >
              {myReview ? 'Update review' : 'Post review'}
            </button>
          </div>
        </div>

        {allReviews.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-white/40 mb-2">All reviews</p>
            <div className="flex flex-col gap-3">
              {allReviews.map((r) => {
                const isMine = r.authorId === user.id
                const friend = !isMine ? friendById(r.authorId) : null
                return (
                  <div key={r.id} className="rounded-xl border border-line bg-panel p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{isMine ? 'You' : friend?.name ?? 'Unknown'}</span>
                      <StarRating value={r.rating} readOnly size="sm" />
                    </div>
                    {r.text && <p className="text-sm text-white/70">{r.text}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showQr && <QRCodeModal show={show} onClose={() => setShowQr(false)} />}
    </>
  )
}
