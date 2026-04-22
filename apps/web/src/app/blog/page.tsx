import { getPublishedPosts } from '@threetone/db'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

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
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex gap-6">
                  {post.cover_image_url && (
                    <div className="shrink-0 w-40 h-28 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        width={160}
                        height={112}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {post.category && (
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-xl font-semibold mt-1 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.published_at && (
                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(post.published_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
