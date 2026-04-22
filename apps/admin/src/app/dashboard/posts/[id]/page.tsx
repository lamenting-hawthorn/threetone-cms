import { createClient } from '@/lib/supabase-server'
import { getPostById } from '@threetone/db'
import { notFound } from 'next/navigation'
import { PostEditor } from '@/components/PostEditor'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const post = await getPostById(supabase, id)

  if (!post) notFound()

  return <PostEditor post={post} />
}
