import { Link } from 'react-router-dom'

export default function TopBar({ title, back }: { title: string; back?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/85 backdrop-blur px-4 py-3 flex items-center gap-3">
      {back ? (
        <Link to={back} className="text-white/60 text-xl leading-none px-1 -ml-1">
          ‹
        </Link>
      ) : (
        <span className="text-xl">🎬</span>
      )}
      <h1 className="font-display font-semibold text-lg tracking-tight">{title}</h1>
    </header>
  )
}
