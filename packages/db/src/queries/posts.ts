import { SupabaseClient } from '@supabase/supabase-js'
import type { Post, PostInsert, PostUpdate } from '../types'

export async function getPublishedPosts(client: SupabaseClient): Promise<Post[]> {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getPublishedPostBySlug(
  client: SupabaseClient,
  slug: string
): Promise<Post | null> {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function getAllPosts(client: SupabaseClient): Promise<Post[]> {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getPostById(
  client: SupabaseClient,
  id: string
): Promise<Post | null> {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createPost(
  client: SupabaseClient,
  post: PostInsert
): Promise<Post> {
  const { data, error } = await client
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePost(
  client: SupabaseClient,
  id: string,
  post: PostUpdate
): Promise<Post> {
  const { data, error } = await client
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePost(
  client: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await client.from('posts').delete().eq('id', id)
  if (error) throw error
}

export async function publishPost(
  client: SupabaseClient,
  id: string
): Promise<Post> {
  return updatePost(client, id, {
    status: 'published',
    published_at: new Date().toISOString(),
  })
}

export async function unpublishPost(
  client: SupabaseClient,
  id: string
): Promise<Post> {
  return updatePost(client, id, { status: 'draft' })
}
