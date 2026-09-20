import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ActivityRow from '../components/ActivityRow'
import ListSummaryCard from '../components/ListSummaryCard'
import { getLists, getListItems, getUser, removeFromList } from '../lib/storage'
import { FRIEND_LISTS, FRIEND_LIST_ITEMS, friendById } from '../data/mockFriends'
import type { ListItem } from '../types'

interface Activity {
  item: ListItem
  listId: string
  listName: string
  authorId: string
  authorName: string
  authorColor: string
}

export default function Home() {
  const user = getUser()
  const [lists] = useState(getLists())
  const [myItems, setMyItems] = useState(getListItems())
  const [tab, setTab] = useState<'all' | 'mine'>('all')

  const activity = useMemo<Activity[]>(() => {
    const mine: Activity[] = myItems.map((item) => {
      const list = lists.find((l) => l.id === item.listId)
      return { item, listId: item.listId, listName: list?.name ?? 'a list', authorId: user.id, authorName: 'You', authorColor: 'from-accent to-accent2' }
    })

    if (tab === 'mine') return mine.sort((a, b) => new Date(b.item.addedAt).getTime() - new Date(a.item.addedAt).getTime())

    const friendActivity: Activity[] = FRIEND_LIST_ITEMS.map((item) => {
      const list = FRIEND_LISTS.find((l) => l.id === item.listId)
      if (!list || list.visibility === 'private') return null
      const friend = friendById(list.ownerId)
      if (!friend) return null
      return { item, listId: item.listId, listName: list.name, authorId: friend.id, authorName: friend.name, authorColor: friend.avatarColor }
    }).filter((a): a is Activity => a !== null)

    return [...mine, ...friendActivity].sort((a, b) => new Date(b.item.addedAt).getTime() - new Date(a.item.addedAt).getTime())
  }, [tab, myItems, lists, user.id])

  function handleRemove(item: ListItem) {
    setMyItems(removeFromList(item.listId, item.showId))
  }

  return (
    <>
      <TopBar title="Reel" />
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wide text-white/40">Your lists</p>
          <Link to="/lists" className="text-xs text-accent2">
            Manage
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-4 px-4">
          {lists.map((list) => (
            <div key={list.id} className="w-40 flex-shrink-0">
              <ListSummaryCard list={list} items={myItems.filter((i) => i.listId === list.id)} to={`/lists/${list.id}`} />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          {(['all', 'mine'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                tab === t ? 'bg-white text-ink border-white' : 'border-line text-white/60'
              }`}
            >
              {t === 'all' ? 'Everyone' : 'Just me'}
            </button>
          ))}
        </div>

        {activity.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🍿</p>
            <p className="text-white/60 text-sm mb-4">Nothing added yet. Point your phone at what you're watching.</p>
            <Link to="/capture" className="inline-block bg-accent text-white text-sm font-medium px-4 py-2 rounded-full">
              Capture a show
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-4">
            {activity.map((a) => (
              <ActivityRow
                key={a.item.id}
                item={a.item}
                authorName={a.authorName}
                authorColor={a.authorColor}
                listName={a.listName}
                onRemove={a.authorId === user.id ? () => handleRemove(a.item) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
