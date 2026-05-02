import { createServiceClient, getPostById } from '@threetone/db'
import { notFound } from 'next/navigation'
import { PreviewBanner } from '@/components/PreviewBanner'
import { PostContent } from '@/components/PostContent'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ id?: string; token?: string }>
}

export default async function PreviewPage({ searchParams }: Props) {
  const { id, token } = await searchParams
  if (!id) notFound()

  if (
    !process.env.PREVIEW_SECRET ||
    token !== process.env.PREVIEW_SECRET
  ) {
    notFound()
  }

  const supabase = createServiceClient()
  const post = await getPostById(supabase, id)
  if (!post) notFound()

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <PreviewBanner />
      <PostContent post={{ ...post, title: post.title || 'Untitled' }} />
    </main>
  )
}
