import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import PostCard from '../components/PostCard'
import ShowPoster from '../components/ShowPoster'
import { friendById, FRIEND_POSTS } from '../data/mockFriends'
import { findShowById } from '../data/shows'

export default function FriendProfile() {
  const { id } = useParams()
  const friend = id ? friendById(id) : undefined

  const posts = useMemo(() => FRIEND_POSTS.filter((p) => p.authorId === id && p.visibility !== 'private'), [id])

  const watchedShows = useMemo(() => {
    const ids = new Set(posts.map((p) => p.showId))
    return [...ids].map(findShowById).filter(Boolean)
  }, [posts])

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

        {watchedShows.length > 0 && (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Recently watched</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {watchedShows.map((show) => (
                <ShowPoster key={show!.id} show={show!} size="sm" />
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Posts</p>
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} authorName={friend.name} authorColor={friend.avatarColor} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
