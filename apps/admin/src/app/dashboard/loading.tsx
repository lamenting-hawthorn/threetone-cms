export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-24 bg-gray-200 rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-100 rounded" />
            </div>
            <div className="flex items-center gap-4 ml-4">
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
              <div className="h-3 w-12 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
