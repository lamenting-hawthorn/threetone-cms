"use client"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="text-center py-20">
      {process.env.NODE_ENV === "development" && (
        <p className="text-xs text-gray-400 mb-4 font-mono">{error.message}</p>
      )}
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-500 text-sm mb-6">Failed to load the dashboard.</p>
      <button
        onClick={reset}
        className="text-sm bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
