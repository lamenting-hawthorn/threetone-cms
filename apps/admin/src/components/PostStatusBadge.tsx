import type { PostStatus } from '@threetone/db'

export function PostStatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        status === 'published'
          ? 'bg-green-100 text-green-700'
          : 'bg-yellow-100 text-yellow-700'
      }`}
    >
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  )
}
