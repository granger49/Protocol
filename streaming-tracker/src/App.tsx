import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Feed from './pages/Feed'
import Capture from './pages/Capture'
import MyShows from './pages/MyShows'
import ShowDetail from './pages/ShowDetail'
import Friends from './pages/Friends'
import FriendProfile from './pages/FriendProfile'
import Profile from './pages/Profile'
import PublicShow from './pages/PublicShow'

export default function App() {
  const location = useLocation()
  const isPublicLanding = location.pathname.startsWith('/s/')

  if (isPublicLanding) {
    return (
      <Routes>
        <Route path="/s/:slug" element={<PublicShow />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-full pb-24">
      <div className="mx-auto max-w-lg">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/shows" element={<MyShows />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friends/:id" element={<FriendProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/show/:slug" element={<ShowDetail />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}
