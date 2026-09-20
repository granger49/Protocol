import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Capture from './pages/Capture'
import Lists from './pages/Lists'
import ListDetail from './pages/ListDetail'
import ShowDetail from './pages/ShowDetail'
import Friends from './pages/Friends'
import FriendProfile from './pages/FriendProfile'
import FriendListDetail from './pages/FriendListDetail'
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
          <Route path="/" element={<Home />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/lists/:id" element={<ListDetail />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friends/:id" element={<FriendProfile />} />
          <Route path="/friends/:id/lists/:listId" element={<FriendListDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/show/:slug" element={<ShowDetail />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}
