export type PostStatus = 'draft' | 'published'

export interface Post {
  id: string
  title: string
  slug: string | null
  excerpt: string | null
  content: string | null
  category: string | null
  cover_image_url: string | null
  video_url: string | null
  seo_title: string | null
  seo_description: string | null
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
  author_id: string | null
}

export type PostInsert = Omit<Post, 'id' | 'created_at' | 'updated_at'>
export type PostUpdate = Partial<PostInsert>

export const CATEGORIES = ['Product', 'Ideas', 'Company', 'Engineering'] as const
export type Category = (typeof CATEGORIES)[number]
