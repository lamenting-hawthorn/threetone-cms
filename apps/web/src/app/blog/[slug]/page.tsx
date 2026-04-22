import { getPublishedPostBySlug, getPublishedPosts } from '@threetone/db'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts(supabase)
  return posts.map(p => ({ slug: p.slug ?? '' })).filter(p => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(supabase, slug)
  if (!post) return {}

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(supabase, slug)

  if (!post) notFound()

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 inline-block">
        ← Blog
      </Link>

      {post.category && (
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {post.category}
        </span>
      )}

      <h1 className="text-4xl font-bold mt-2 mb-4 leading-tight">{post.title}</h1>

      {post.excerpt && (
        <p className="text-xl text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>
      )}

      {post.published_at && (
        <p className="text-sm text-gray-400 mb-8">
          {new Date(post.published_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
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

      {post.video_url && (
        <div className="mb-10 aspect-video rounded-2xl overflow-hidden bg-black">
          <VideoEmbed url={post.video_url} />
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

function VideoEmbed({ url }: { url: string }) {
  let embedUrl = url

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return (
    <iframe
      src={embedUrl}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
