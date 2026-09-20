import { useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ListSummaryCard from '../components/ListSummaryCard'
import { friendById, listsForFriend, itemsForList } from '../data/mockFriends'

export default function FriendProfile() {
  const { id } = useParams()
  const friend = id ? friendById(id) : undefined
  const lists = id ? listsForFriend(id) : []

  if (!friend) {
    return (
      <>
        <TopBar title="Not found" back="/friends" />
        <p className="px-4 py-8 text-sm text-white/50">Couldn't find that friend.</p>
      </>
    )
  }

  return (
    <>
      <TopBar title={friend.name} back="/friends" />
      <div className="px-4 pt-4 pb-8">
        <div className="flex items-center gap-3">
          <span className={`h-16 w-16 rounded-full bg-gradient-to-br ${friend.avatarColor} flex-shrink-0`} />
          <div>
            <p className="font-display font-semibold text-lg">{friend.name}</p>
            <p className="text-xs text-white/40">@{friend.handle}</p>
          </div>
        </div>
        <p className="text-sm text-white/70 mt-3">{friend.bio}</p>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-white/40 mb-2">
            {friend.name.split(' ')[0]}'s lists
          </p>
          {lists.length === 0 ? (
            <p className="text-sm text-white/40">No public or shared lists yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {lists.map((list) => (
                <ListSummaryCard key={list.id} list={list} items={itemsForList(list.id)} to={`/friends/${friend.id}/lists/${list.id}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
