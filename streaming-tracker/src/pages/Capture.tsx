import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import PhotoCapture from '../components/PhotoCapture'
import RecognitionResults from '../components/RecognitionResults'
import ShowPoster from '../components/ShowPoster'
import StarRating from '../components/StarRating'
import PlatformBadge from '../components/PlatformBadge'
import { recognizeFromPhoto, type RecognitionCandidate } from '../lib/recognize'
import { addReview, addToList, createList, getLists, getUser, moveToDefaultList, uid } from '../lib/storage'
import type { DefaultListKind, ListDef, Show, Visibility } from '../types'

type Step = 'capture' | 'recognizing' | 'confirm' | 'compose' | 'done'

export default function Capture() {
  const navigate = useNavigate()
  const user = getUser()
  const [step, setStep] = useState<Step>('capture')
  const [photo, setPhoto] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<RecognitionCandidate[]>([])
  const [show, setShow] = useState<Show | null>(null)
  const [note, setNote] = useState('')
  const [rating, setRating] = useState(0)
  const [lists, setLists] = useState<ListDef[]>(getLists())
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [creatingList, setCreatingList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [postedListName, setPostedListName] = useState('')

  async function handleCapture(dataUrl: string) {
    setPhoto(dataUrl)
    setStep('recognizing')
    const results = await recognizeFromPhoto(dataUrl)
    setCandidates(results)
    setStep('confirm')
  }

  function handleSelect(selected: Show) {
    setShow(selected)
    const watching = lists.find((l) => l.kind === 'watching')
    setSelectedListId(watching?.id ?? lists[0]?.id ?? null)
    setStep('compose')
  }

  function reset() {
    setPhoto(null)
    setCandidates([])
    setShow(null)
    setNote('')
    setRating(0)
    setSelectedListId(null)
    setStep('capture')
  }

  function handleCreateList() {
    if (!newListName.trim()) return
    const { lists: next, list } = createList(newListName.trim(), 'friends' as Visibility)
    setLists(next)
    setSelectedListId(list.id)
    setNewListName('')
    setCreatingList(false)
  }

  function handlePost() {
    if (!show || !selectedListId) return
    const list = lists.find((l) => l.id === selectedListId)
    if (!list) return

    if (list.kind !== 'custom') {
      moveToDefaultList(show.id, list.kind as DefaultListKind, { photo, note })
    } else {
      addToList(list.id, show.id, { photo, note })
    }

    if (rating) {
      addReview({
        id: uid('rev'),
        showId: show.id,
        authorId: user.id,
        rating,
        text: note,
        createdAt: new Date().toISOString(),
      })
    }

    setPostedListName(list.name)
    setStep('done')
  }

  return (
    <>
      <TopBar title={step === 'compose' ? 'Add to a list' : 'Capture'} />
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
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Add to which list?</p>
              <div className="flex flex-col gap-2">
                {lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      selectedListId === list.id ? 'border-accent2/50 bg-accent2/10' : 'border-line'
                    }`}
                  >
                    <span className="text-sm font-medium">{list.name}</span>
                    <span className="text-xs text-white/40">
                      {list.visibility === 'public' ? '🌐' : list.visibility === 'friends' ? '👥' : '🔒'}
                    </span>
                  </button>
                ))}

                {!creatingList ? (
                  <button
                    onClick={() => setCreatingList(true)}
                    className="rounded-xl border border-dashed border-line px-3 py-2.5 text-left text-sm text-white/50"
                  >
                    + New list
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="List name"
                      className="flex-1 bg-white/5 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-accent2/50"
                    />
                    <button onClick={handleCreateList} className="rounded-lg bg-accent px-3 text-sm font-medium">
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Rating (optional)</p>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Note (optional)</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What did you think?"
                rows={3}
                className="w-full rounded-xl bg-white/5 border border-line px-3 py-2.5 text-sm outline-none focus:border-accent2/50 resize-none"
              />
            </div>

            <button
              onClick={handlePost}
              disabled={!selectedListId}
              className="w-full bg-accent text-white font-medium py-3 rounded-full disabled:opacity-30"
            >
              Add to list
            </button>
          </div>
        )}

        {step === 'done' && show && (
          <div className="flex flex-col items-center text-center py-16 gap-4 animate-pop">
            <p className="text-5xl">✅</p>
            <p className="font-display font-semibold text-lg">Added to {postedListName}</p>
            <p className="text-sm text-white/50">{show.title} is now in your "{postedListName}" list.</p>
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
