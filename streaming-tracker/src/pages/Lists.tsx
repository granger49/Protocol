import { useState } from 'react'
import TopBar from '../components/TopBar'
import ListSummaryCard from '../components/ListSummaryCard'
import { createList, getLists, getListItems } from '../lib/storage'
import type { Visibility } from '../types'

const VISIBILITY_OPTIONS: { value: Visibility; label: string }[] = [
  { value: 'public', label: '🌐 Public' },
  { value: 'friends', label: '👥 Friends' },
  { value: 'private', label: '🔒 Only me' },
]

export default function Lists() {
  const [lists, setLists] = useState(getLists())
  const [items] = useState(getListItems())
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('friends')

  function handleCreate() {
    if (!name.trim()) return
    const { lists: next } = createList(name.trim(), visibility)
    setLists(next)
    setName('')
    setVisibility('friends')
    setCreating(false)
  }

  const defaultLists = lists.filter((l) => l.kind !== 'custom')
  const customLists = lists.filter((l) => l.kind === 'custom')

  return (
    <>
      <TopBar title="Your Lists" />
      <div className="px-4 pt-3 pb-8">
        <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Default lists</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {defaultLists.map((list) => (
            <ListSummaryCard key={list.id} list={list} items={items.filter((i) => i.listId === list.id)} to={`/lists/${list.id}`} />
          ))}
        </div>

        {customLists.length > 0 && (
          <>
            <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Your custom lists</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {customLists.map((list) => (
                <ListSummaryCard key={list.id} list={list} items={items.filter((i) => i.listId === list.id)} to={`/lists/${list.id}`} />
              ))}
            </div>
          </>
        )}

        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="w-full rounded-full border border-dashed border-line py-2.5 text-sm text-white/50"
          >
            + New list
          </button>
        ) : (
          <div className="rounded-xl2 border border-line bg-panel p-4 flex flex-col gap-3 animate-pop">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Oscar contenders, Date night"
              className="w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-accent2/50"
            />
            <div className="flex gap-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setVisibility(opt.value)}
                  className={`flex-1 text-xs rounded-full border py-1.5 transition-colors ${
                    visibility === opt.value ? 'border-accent2/50 bg-accent2/10' : 'border-line text-white/60'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCreating(false)}
                className="flex-1 rounded-full border border-line py-2 text-sm text-white/60"
              >
                Cancel
              </button>
              <button onClick={handleCreate} className="flex-1 rounded-full bg-accent py-2 text-sm font-medium">
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
