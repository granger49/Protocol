'use client'

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Progress Tracking</h2>
        
        <div className="space-y-6">
          <div className="p-6 bg-primary-50 border border-primary-200 rounded-xl">
            <h3 className="font-bold text-neutral-900 mb-3">4-Week Cycle Features (Coming Soon)</h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Weekly weigh-ins and body metrics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Strength progression tracking (PR history)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Achilles status timeline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                End-of-cycle Q&A for adjustments
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Charts for lifts, weight, body composition
              </li>
            </ul>
          </div>

          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
            <h3 className="font-bold text-neutral-900 mb-3">Current Cycle Status</h3>
            <div className="space-y-2 text-sm text-neutral-700">
              <p><span className="font-medium">Week:</span> 1 of 4</p>
              <p><span className="font-medium">Target:</span> +0.25-0.3 lb/week (1-1.2 lbs total)</p>
              <p><span className="font-medium">Achilles goal:</span> Maintain 0-1 pain level</p>
            </div>
          </div>

          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl">
            <h3 className="font-bold text-neutral-900 mb-3">Recent PRs</h3>
            <p className="text-sm text-neutral-500">No personal records logged yet. Complete workouts to track your progress.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
