export default function EditPostLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded-lg" />
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="h-10 w-full border-b border-gray-200 pb-3" />
          <div className="h-14 w-full bg-gray-200 rounded-lg" />
          <div className="h-[400px] w-full bg-gray-200 rounded-xl" />
        </div>
        <div className="col-span-1 space-y-5">
          <div className="h-28 w-full bg-gray-200 rounded-lg" />
          <div className="h-14 w-full bg-gray-200 rounded-lg" />
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
          <div className="space-y-3">
            <div className="h-3 w-8 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
