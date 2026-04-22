import { createClient } from '@supabase/supabase-js'
import { getPostById } from '@threetone/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function PreviewPage({ searchParams }: Props) {
  const { id } = await searchParams
  if (!id) notFound()

  // Use service role to see draft posts
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const post = await getPostById(supabase, id)
  if (!post) notFound()

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-700 flex items-center gap-2">
        <span>Draft preview</span>
        <span className="text-yellow-400">·</span>
        <span>Not publicly visible</span>
        <Link href="/blog" className="ml-auto text-yellow-600 hover:text-yellow-800">View blog →</Link>
      </div>

      {post.category && (
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{post.category}</span>
      )}

      <h1 className="text-4xl font-bold mt-2 mb-4 leading-tight">{post.title || 'Untitled'}</h1>

      {post.excerpt && (
        <p className="text-xl text-gray-500 leading-relaxed mb-8">{post.excerpt}</p>
      )}

      {post.cover_image_url && (
        <div className="rounded-2xl overflow-hidden mb-10 bg-gray-100">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            width={800}
            height={450}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      {post.content && (
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </main>
  )
}
