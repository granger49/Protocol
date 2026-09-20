import { useEffect, useRef, useState } from 'react'

export default function PhotoCapture({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraFailed, setCameraFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setCameraReady(true)
      } catch {
        setCameraFailed(true)
      }
    }
    startCamera()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function shutter() {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    onCapture(canvas.toDataURL('image/jpeg', 0.85))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onCapture(reader.result as string)
    reader.readAsDataURL(file)
  }

  if (cameraFailed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-4xl">📷</p>
        <p className="text-sm text-white/60 max-w-xs">
          Couldn't access your camera directly — use your device camera instead.
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-full"
        >
          Open camera
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    )
  }

  return (
    <div className="relative rounded-xl2 overflow-hidden bg-black aspect-[3/4]">
      <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <p className="text-sm text-white/50">Starting camera…</p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-white/30" />
      <div className="pointer-events-none absolute inset-6 overflow-hidden rounded-xl">
        <div className="h-0.5 w-full bg-accent2/80 shadow-[0_0_12px_2px_rgba(90,200,250,0.7)] animate-scan" />
      </div>
      <p className="absolute top-3 left-0 right-0 text-center text-xs text-white/70">
        Point at the TV and tap the shutter
      </p>

      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-8">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-lg"
          aria-label="Upload from gallery"
        >
          🖼️
        </button>
        <button
          onClick={shutter}
          disabled={!cameraReady}
          className="h-16 w-16 rounded-full bg-white ring-4 ring-white/30 active:scale-95 transition-transform disabled:opacity-40"
          aria-label="Take photo"
        />
        <span className="h-10 w-10" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
