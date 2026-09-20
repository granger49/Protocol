import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import PhotoCapture from '../components/PhotoCapture'
import RecognitionResults from '../components/RecognitionResults'
import ShowPoster from '../components/ShowPoster'
import StarRating from '../components/StarRating'
import PlatformBadge from '../components/PlatformBadge'
import { recognizeFromPhoto, type RecognitionCandidate } from '../lib/recognize'
import { addPost, getUser, setLibraryStatus, uid } from '../lib/storage'
import type { Show, Visibility } from '../types'

type Step = 'capture' | 'recognizing' | 'confirm' | 'compose' | 'done'

const VISIBILITY_OPTIONS: { value: Visibility; label: string; hint: string }[] = [
  { value: 'public', label: '🌐 Public', hint: 'Anyone with your link' },
  { value: 'friends', label: '👥 Friends', hint: 'People you follow back' },
  { value: 'private', label: '🔒 Only me', hint: 'Just for your library' },
]

export default function Capture() {
  const navigate = useNavigate()
  const user = getUser()
  const [step, setStep] = useState<Step>('capture')
  const [photo, setPhoto] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<RecognitionCandidate[]>([])
  const [show, setShow] = useState<Show | null>(null)
  const [caption, setCaption] = useState('')
  const [rating, setRating] = useState(0)
  const [visibility, setVisibility] = useState<Visibility>('friends')

  async function handleCapture(dataUrl: string) {
    setPhoto(dataUrl)
    setStep('recognizing')
    const results = await recognizeFromPhoto(dataUrl)
    setCandidates(results)
    setStep('confirm')
  }

  function handleSelect(selected: Show) {
    setShow(selected)
    setStep('compose')
  }

  function reset() {
    setPhoto(null)
    setCandidates([])
    setShow(null)
    setCaption('')
    setRating(0)
    setStep('capture')
  }

  function handlePost() {
    if (!show) return
    addPost({
      id: uid('post'),
      authorId: user.id,
      showId: show.id,
      photo,
      caption,
      rating: rating || null,
      visibility,
      createdAt: new Date().toISOString(),
    })
    setLibraryStatus(show.id, 'watching')
    setStep('done')
  }

  return (
    <>
      <TopBar title={step === 'compose' ? 'New post' : 'Capture'} />
      <div className="px-4 pt-3 pb-8">
        {step === 'capture' && <PhotoCapture onCapture={handleCapture} />}

        {step === 'recognizing' && (
          <div className="flex flex-col items-center gap-4 py-16">
            {photo && <img src={photo} className="w-40 rounded-xl opacity-60" />}
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span className="h-2 w-2 rounded-full bg-accent2 animate-pulse" />
              Identifying what's on screen…
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <RecognitionResults candidates={candidates} onSelect={handleSelect} onRetake={reset} />
        )}

        {step === 'compose' && show && (
          <div className="flex flex-col gap-5 animate-pop">
            {photo && <img src={photo} className="w-full aspect-video object-cover rounded-xl" />}

            <div className="flex items-center gap-3">
              <ShowPoster show={show} size="sm" />
              <div>
                <p className="font-display font-semibold">{show.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {show.platforms.map((p) => (
                    <PlatformBadge key={p} platform={p} />
                  ))}
                </div>
              </div>
              <button onClick={() => setStep('confirm')} className="ml-auto text-xs text-white/40 underline">
                change
              </button>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Your rating</p>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Caption</p>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What did you think?"
                rows={3}
                className="w-full rounded-xl bg-white/5 border border-line px-3 py-2.5 text-sm outline-none focus:border-accent2/50 resize-none"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Who can see this</p>
              <div className="flex flex-col gap-2">
                {VISIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setVisibility(opt.value)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      visibility === opt.value ? 'border-accent2/50 bg-accent2/10' : 'border-line'
                    }`}
                  >
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className="text-xs text-white/40">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handlePost} className="w-full bg-accent text-white font-medium py-3 rounded-full">
              Post
            </button>
          </div>
        )}

        {step === 'done' && show && (
          <div className="flex flex-col items-center text-center py-16 gap-4 animate-pop">
            <p className="text-5xl">✅</p>
            <p className="font-display font-semibold text-lg">Posted to your feed</p>
            <p className="text-sm text-white/50">{show.title} was added to your library as Watching.</p>
            <div className="flex gap-2 mt-2">
              <button onClick={reset} className="rounded-full border border-line px-4 py-2 text-sm">
                Capture another
              </button>
              <button
                onClick={() => navigate(`/show/${show.slug}`)}
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium"
              >
                View show
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
