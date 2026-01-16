import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Athletic Longevity Training',
  description: 'Your personalized athletic longevity training agent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 antialiased">
        {children}
      </body>
    </html>
  )
}
