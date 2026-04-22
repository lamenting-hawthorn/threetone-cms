import { createClient } from '@/lib/supabase-server'
import { getAllPosts } from '@threetone/db'
import Link from 'next/link'
import { PostStatusBadge } from '@/components/PostStatusBadge'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const posts = await getAllPosts(supabase)

  const published = posts.filter(p => p.status === 'published').length
  const drafts = posts.filter(p => p.status === 'draft').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="bg-black text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-sm">No posts yet.</p>
          <Link href="/dashboard/posts/new" className="text-sm text-black underline mt-2 inline-block">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/dashboard/posts/${post.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">
                  {post.title || <span className="text-gray-400 italic">Untitled</span>}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {post.category && <span className="mr-2">{post.category}</span>}
                  {post.slug && <span className="font-mono">/{post.slug}</span>}
                </p>
              </div>
              <div className="flex items-center gap-4 ml-4 shrink-0">
                <PostStatusBadge status={post.status} />
                <span className="text-xs text-gray-400">
                  {new Date(post.updated_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
