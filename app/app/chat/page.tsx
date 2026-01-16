'use client'

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Ask Your Coach</h2>
        <p className="text-neutral-600 mb-6">
          Ask questions about your program, request exercise substitutions, or get advice on progression.
        </p>
        
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="font-medium text-neutral-900 mb-3">Coming soon:</p>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Exercise form questions
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Workout modifications on the fly
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Progression advice
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Pain/injury management
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Equipment substitutions
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
