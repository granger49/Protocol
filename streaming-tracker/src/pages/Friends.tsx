import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { FRIENDS, FRIEND_POSTS } from '../data/mockFriends'

export default function Friends() {
  return (
    <>
      <TopBar title="Friends" />
      <div className="px-4 pt-3 pb-8">
        <p className="text-xs text-white/40 mb-4">
          This is a local demo, so friends are seeded — in the real app you'd invite people or find them by handle.
        </p>
        <div className="flex flex-col gap-2">
          {FRIENDS.map((friend) => {
            const postCount = FRIEND_POSTS.filter((p) => p.authorId === friend.id).length
            return (
              <Link
                key={friend.id}
                to={`/friends/${friend.id}`}
                className="flex items-center gap-3 rounded-xl2 border border-line bg-panel p-3"
              >
                <span className={`h-12 w-12 rounded-full bg-gradient-to-br ${friend.avatarColor} flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{friend.name}</p>
                  <p className="text-xs text-white/40">
                    @{friend.handle} · {postCount} post{postCount === 1 ? '' : 's'}
                  </p>
                </div>
                <span className="text-white/30">›</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
