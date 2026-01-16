'use client'

import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const supabase = createClient()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-lg text-neutral-900">Athletic Longevity</span>
          </div>
          <button
            onClick={handleSignIn}
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6">
              Your personal training agent for{' '}
              <span className="text-primary-600">athletic longevity</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-10 leading-relaxed">
              A comprehensive training system designed for sustainable performance. 
              Track workouts, monitor Achilles recovery, and optimize your training across 
              strength, stability, mobility, and cardio.
            </p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-3 px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="py-16 border-t border-neutral-200">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-neutral-50">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">Comprehensive Training</h3>
              <p className="text-neutral-600">
                60+ exercises across 7 categories: warmup, strength, stability, cardio, mobility, tone, and rehab.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-neutral-50">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">Cross-Device Sync</h3>
              <p className="text-neutral-600">
                Access your training from any device. Your workout data syncs automatically across all platforms.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-neutral-50">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🩹</span>
              </div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">Injury Management</h3>
              <p className="text-neutral-600">
                Built-in Achilles recovery tracking with pain monitoring and progressive rehab protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Structure */}
        <div className="py-16 border-t border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Weekly Training Structure</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { day: 'Mon', name: 'Full Body A', highlight: 'Push/Lower' },
              { day: 'Tue', name: 'Recovery', highlight: 'Stability' },
              { day: 'Wed', name: 'VO2 Max', highlight: 'Basketball/4x4' },
              { day: 'Thu', name: 'Full Body B', highlight: 'Pull/Lower' },
              { day: 'Fri', name: 'Accessory', highlight: 'Hypertrophy' },
              { day: 'Sat', name: 'Active', highlight: 'Rucking' },
              { day: 'Sun', name: 'Long Cardio', highlight: 'Zone 2' },
            ].map((item) => (
              <div key={item.day} className="p-4 rounded-lg border border-neutral-200 bg-white">
                <div className="text-sm font-medium text-neutral-500 mb-1">{item.day}</div>
                <div className="font-semibold text-neutral-900">{item.name}</div>
                <div className="text-sm text-primary-600">{item.highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-neutral-500">
            Built for athletic longevity. Based on evidence-based protocols.
          </p>
        </div>
      </footer>
    </div>
  )
}
