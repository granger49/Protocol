import { useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ActivityRow from '../components/ActivityRow'
import { friendById, itemsForList, FRIEND_LISTS } from '../data/mockFriends'

export default function FriendListDetail() {
  const { id, listId } = useParams()
  const friend = id ? friendById(id) : undefined
  const list = FRIEND_LISTS.find((l) => l.id === listId && l.ownerId === id)
  const items = listId ? itemsForList(listId) : []

  if (!friend || !list) {
    return (
      <>
        <TopBar title="Not found" back={id ? `/friends/${id}` : '/friends'} />
        <p className="px-4 py-8 text-sm text-white/50">That list isn't visible to you.</p>
      </>
    )
  }

  return (
    <>
      <TopBar title={`${friend.name.split(' ')[0]}'s ${list.name}`} back={`/friends/${friend.id}`} />
      <div className="px-4 pt-4 pb-8">
        <p className="text-xs text-white/40 mb-4">
          {items.length} show{items.length === 1 ? '' : 's'}
        </p>
        {items.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-10">Nothing in this list yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <ActivityRow key={item.id} item={item} authorName={friend.name} authorColor={friend.avatarColor} listName={list.name} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
