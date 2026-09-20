import { useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import { clearAllData, exportData, getUser, importData, saveUser } from '../lib/storage'

export default function Profile() {
  const [user, setUser] = useState(getUser())
  const [savedFlash, setSavedFlash] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function save() {
    saveUser(user)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1200)
  }

  function download() {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reel-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importData(reader.result as string)
        window.location.reload()
      } catch {
        alert('Could not read that file.')
      }
    }
    reader.readAsText(file)
  }

  function reset() {
    if (confirm('Clear all local data? This removes your lists, ratings, and reviews.')) {
      clearAllData()
      window.location.reload()
    }
  }

  return (
    <>
      <TopBar title="Profile" />
      <div className="px-4 pt-4 pb-8 flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40 mb-2">You</p>
          <div className="rounded-xl2 border border-line bg-panel p-4 flex flex-col gap-3">
            <label className="text-xs text-white/50">
              Display name
              <input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="mt-1 w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-accent2/50"
              />
            </label>
            <label className="text-xs text-white/50">
              Handle
              <input
                value={user.handle}
                onChange={(e) => setUser({ ...user, handle: e.target.value })}
                className="mt-1 w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-accent2/50"
              />
            </label>
            <button onClick={save} className="rounded-full bg-accent text-white text-sm font-medium py-2">
              {savedFlash ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Your data</p>
          <div className="rounded-xl2 border border-line bg-panel p-4 flex flex-col gap-2">
            <p className="text-xs text-white/50 mb-1">
              Everything lives in this browser's local storage — nothing leaves your device yet.
            </p>
            <button onClick={download} className="rounded-full border border-line py-2 text-sm">
              Export data (.json)
            </button>
            <button onClick={() => fileRef.current?.click()} className="rounded-full border border-line py-2 text-sm">
              Import data
            </button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
            <button onClick={reset} className="rounded-full border border-red-900/50 text-red-400 py-2 text-sm">
              Clear all data
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-white/40 mb-2">About this build</p>
          <div className="rounded-xl2 border border-line bg-panel p-4 text-xs text-white/50 leading-relaxed flex flex-col gap-2">
            <p>This is a local-first prototype for working out the UX. A few things are simulated for now:</p>
            <ul className="list-disc pl-4 flex flex-col gap-1">
              <li>Show recognition from a photo picks a plausible match from a small local catalog rather than calling a real vision API.</li>
              <li>Friends and their lists are seeded so the home activity feed feels alive without a backend.</li>
              <li>"Where to watch" data is hardcoded per show instead of coming from a live availability API.</li>
            </ul>
            <p>Swap points are isolated in <code>src/lib/recognize.ts</code> (recognition) and <code>src/data</code> (catalog + social) so real APIs and a shared backend can replace them without touching the UI.</p>
          </div>
        </div>
      </div>
    </>
  )
}
