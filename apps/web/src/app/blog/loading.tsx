export default function BlogLoading() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 animate-pulse">
      <div className="h-10 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-5 w-64 bg-gray-100 rounded mb-12" />

      <div className="grid gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-6">
            <div className="shrink-0 w-40 h-28 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
