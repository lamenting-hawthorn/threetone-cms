import { getPublishedPosts } from '@threetone/db'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import { PostCard } from '@/components/PostCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on voice AI, sales, and building Threetone.',
}

export default async function BlogPage() {
  const posts = await getPublishedPosts(supabase)

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-2">Blog</h1>
      <p className="text-gray-500 mb-12">Thoughts on voice AI, sales, and building Threetone.</p>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet.</p>
      ) : (
        <div className="grid gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  )
}
