import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import PostCard from '../components/PostCard'
import { getPosts, getUser, deletePost } from '../lib/storage'
import { FRIEND_POSTS, friendById } from '../data/mockFriends'
import type { Post } from '../types'

export default function Feed() {
  const user = getUser()
  const [myPosts, setMyPosts] = useState<Post[]>(getPosts())
  const [tab, setTab] = useState<'all' | 'mine'>('all')

  const feed = useMemo(() => {
    const visibleFriendPosts = FRIEND_POSTS.filter((p) => p.visibility !== 'private')
    const combined = tab === 'mine' ? myPosts : [...myPosts, ...visibleFriendPosts]
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [tab, myPosts])

  function handleDelete(id: string) {
    setMyPosts(deletePost(id))
  }

  return (
    <>
      <TopBar title="Reel" />
      <div className="px-4 pt-3">
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

        {feed.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🍿</p>
            <p className="text-white/60 text-sm mb-4">No posts yet. Point your phone at what you're watching.</p>
            <Link to="/capture" className="inline-block bg-accent text-white text-sm font-medium px-4 py-2 rounded-full">
              Capture a show
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {feed.map((post) => {
              const isMine = post.authorId === user.id
              const friend = !isMine ? friendById(post.authorId) : null
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  authorName={isMine ? 'You' : friend?.name ?? 'Unknown'}
                  authorColor={isMine ? 'from-accent to-accent2' : friend?.avatarColor ?? 'from-gray-500 to-gray-400'}
                  onDelete={isMine ? () => handleDelete(post.id) : undefined}
                />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
