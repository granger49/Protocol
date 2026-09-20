import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ActivityRow from '../components/ActivityRow'
import { deleteList, getListItems, getLists, removeFromList, renameList, updateListVisibility } from '../lib/storage'
import type { Visibility } from '../types'

const VISIBILITY_OPTIONS: { value: Visibility; label: string }[] = [
  { value: 'public', label: '🌐 Public' },
  { value: 'friends', label: '👥 Friends' },
  { value: 'private', label: '🔒 Only me' },
]

export default function ListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lists, setLists] = useState(getLists())
  const [items, setItems] = useState(getListItems())
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')

  const list = lists.find((l) => l.id === id)
  const listItems = useMemo(
    () =>
      items
        .filter((i) => i.listId === id)
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()),
    [items, id],
  )

  if (!list) {
    return (
      <>
        <TopBar title="Not found" back="/lists" />
        <p className="px-4 py-8 text-sm text-white/50">That list doesn't exist.</p>
      </>
    )
  }

  function saveName() {
    if (!list) return
    if (nameDraft.trim()) setLists(renameList(list.id, nameDraft.trim()))
    setEditingName(false)
  }

  function setVisibility(v: Visibility) {
    if (!list) return
    setLists(updateListVisibility(list.id, v))
  }

  function handleRemove(showId: string) {
    if (!list) return
    setItems(removeFromList(list.id, showId))
  }

  function handleDelete() {
    if (!list) return
    if (!confirm(`Delete "${list.name}"? This removes the list but not the shows in it.`)) return
    deleteList(list.id)
    navigate('/lists')
  }

  return (
    <>
      <TopBar title={list.name} back="/lists" />
      <div className="px-4 pt-4 pb-8">
        <div className="flex items-center gap-2 mb-1">
          {editingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              className="flex-1 bg-white/5 border border-line rounded-lg px-2 py-1 text-lg font-display font-semibold outline-none"
            />
          ) : (
            <h2 className="font-display font-semibold text-xl">{list.name}</h2>
          )}
          <button
            onClick={() => {
              setNameDraft(list.name)
              setEditingName((v) => !v)
            }}
            className="text-xs text-white/40 underline"
          >
            rename
          </button>
        </div>
        <p className="text-xs text-white/40 mb-4">
          {listItems.length} show{listItems.length === 1 ? '' : 's'}
        </p>

        <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Who can see this list</p>
        <div className="flex gap-2 mb-6">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setVisibility(opt.value)}
              className={`flex-1 text-xs rounded-full border py-1.5 transition-colors ${
                list.visibility === opt.value ? 'border-accent2/50 bg-accent2/10' : 'border-line text-white/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {listItems.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-10">
            Nothing here yet — add shows from the Capture tab or a show's page.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {listItems.map((item) => (
              <ActivityRow
                key={item.id}
                item={item}
                authorName="You"
                authorColor="from-accent to-accent2"
                listName={list.name}
                onRemove={() => handleRemove(item.showId)}
              />
            ))}
          </div>
        )}

        {list.kind === 'custom' && (
          <button onClick={handleDelete} className="w-full mt-6 rounded-full border border-red-900/50 text-red-400 py-2.5 text-sm">
            Delete list
          </button>
        )}
      </div>
    </>
  )
}
