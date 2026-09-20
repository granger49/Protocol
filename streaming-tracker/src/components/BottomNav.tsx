import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/lists', label: 'Lists', icon: '📺' },
  { to: '/capture', label: 'Capture', icon: '📸', primary: true },
  { to: '/friends', label: 'Friends', icon: '👥' },
  { to: '/profile', label: 'Profile', icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-panel/90 backdrop-blur safe-bottom">
      <div className="mx-auto max-w-lg flex items-stretch justify-between px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-white/50'
              }`
            }
          >
            {({ isActive }) =>
              item.primary ? (
                <span
                  className={`-mt-6 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-lg shadow-accent/30 transition-transform ${
                    isActive ? 'bg-accent scale-105' : 'bg-accent/90'
                  }`}
                >
                  {item.icon}
                </span>
              ) : (
                <>
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
