import { useEffect, useState } from 'react'
import type { Show } from '../types'
import { makeQrDataUrl, publicShowUrl } from '../lib/qr'

export default function QRCodeModal({ show, onClose }: { show: Show; onClose: () => void }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const url = publicShowUrl(show.slug)

  useEffect(() => {
    makeQrDataUrl(url).then(setDataUrl)
  }, [url])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-pop w-full sm:w-96 sm:rounded-xl2 rounded-t-xl2 bg-panel border border-line p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-wide text-white/40 mb-1">Scan to view &amp; download</p>
        <h2 className="font-display font-semibold text-xl mb-4">{show.title}</h2>

        <div className="bg-white rounded-xl p-3 inline-block">
          {dataUrl ? (
            <img src={dataUrl} alt={`QR code linking to ${show.title}`} className="w-56 h-56" />
          ) : (
            <div className="w-56 h-56 animate-pulse bg-black/10 rounded-lg" />
          )}
        </div>

        <p className="text-xs text-white/50 mt-4 break-all">{url}</p>
        <p className="text-xs text-white/40 mt-1">
          Anyone who scans this lands on {show.title}'s page and gets prompted to download Reel.
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full border border-line py-2.5 text-sm font-medium text-white/70 hover:text-white hover:border-white/30 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
