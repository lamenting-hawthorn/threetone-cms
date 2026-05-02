import Link from "next/link"

export function PreviewBanner() {
  return (
    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-700 flex items-center gap-2">
      <span>Draft preview</span>
      <span className="text-yellow-400">·</span>
      <span>Not publicly visible</span>
      <Link href="/blog" className="ml-auto text-yellow-600 hover:text-yellow-800">
        View blog →
      </Link>
    </div>
  )
}
