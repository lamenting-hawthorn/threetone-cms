'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@threetone/db'
import { CATEGORIES } from '@threetone/db'
import { createClient } from '@/lib/supabase'
import { RichTextEditor } from './editor/RichTextEditor'
import { PostStatusBadge } from './PostStatusBadge'
import slugify from 'slugify'
import Image from 'next/image'

interface Props {
  post?: Post
}

function generateSlug(title: string) {
  return slugify(title, { lower: true, strict: true, trim: true })
}

export function PostEditor({ post }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const isNew = !post

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post?.slug)
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [category, setCategory] = useState(post?.category ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? '')
  const [videoUrl, setVideoUrl] = useState(post?.video_url ?? '')
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? '')
  const [status, setStatus] = useState(post?.status ?? 'draft')

  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [coverUploading, setCoverUploading] = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function scheduleAutosave() {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => handleSave('autosave'), 3000)
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugManuallyEdited) {
      setSlug(generateSlug(value))
    }
    scheduleAutosave()
  }

  async function handleSave(mode: 'save' | 'publish' | 'unpublish' | 'autosave' = 'save') {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    setSaving(true)

    const newStatus =
      mode === 'publish' ? 'published' :
      mode === 'unpublish' ? 'draft' :
      status

    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      title,
      slug: slug || null,
      excerpt: excerpt || null,
      content: content || null,
      category: category || null,
      cover_image_url: coverImageUrl || null,
      video_url: videoUrl || null,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      status: newStatus,
      published_at: mode === 'publish' ? new Date().toISOString() : post?.published_at ?? null,
      author_id: isNew ? user?.id ?? null : undefined,
    }

    try {
      if (isNew) {
        const { data, error } = await supabase
          .from('posts')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        setStatus(newStatus)
        setSaveMessage(mode === 'autosave' ? 'Autosaved' : 'Saved')
        router.replace(`/dashboard/posts/${data.id}`)
      } else {
        const { error } = await supabase
          .from('posts')
          .update(payload)
          .eq('id', post.id)
        if (error) throw error
        setStatus(newStatus)
        setSaveMessage(mode === 'publish' ? 'Published!' : mode === 'unpublish' ? 'Unpublished' : mode === 'autosave' ? 'Autosaved' : 'Saved')
      }

      if (mode === 'publish' || mode === 'unpublish') {
        void revalidateWebApp(slug, post?.slug ?? slug)
      }
    } catch (err: unknown) {
      setSaveMessage('Error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMessage(''), 2500)
    }
  }

  async function revalidateWebApp(currentSlug: string, previousSlug?: string) {
    const base = process.env.NEXT_PUBLIC_WEB_URL
    const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET
    if (!base || !secret) return

    const paths = ['/blog']
    if (currentSlug) paths.push(`/blog/${currentSlug}`)
    if (previousSlug && previousSlug !== currentSlug) paths.push(`/blog/${previousSlug}`)

    try {
      await fetch(`${base}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, paths }),
      })
    } catch {
      // Revalidation is best-effort; don't block the editor on failure
    }
  }

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filename, file, { cacheControl: '31536000' })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename)
    return publicUrl
  }, [supabase])

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const url = await handleImageUpload(file)
      setCoverImageUrl(url)
    } finally {
      setCoverUploading(false)
    }
  }

  const webPreviewUrl = process.env.NEXT_PUBLIC_WEB_URL
    ? `${process.env.NEXT_PUBLIC_WEB_URL}/blog/preview?id=${post?.id}&token=${process.env.NEXT_PUBLIC_PREVIEW_SECRET}`
    : null

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Posts
          </button>
          <PostStatusBadge status={status} />
          {saveMessage && (
            <span className="text-xs text-gray-400">{saveMessage}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {webPreviewUrl && slug && (
            <a
              href={webPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Preview
            </a>
          )}
          <button
            type="button"
            onClick={() => handleSave('save')}
            disabled={saving}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          {status === 'published' ? (
            <button
              type="button"
              onClick={() => handleSave('unpublish')}
              disabled={saving}
              className="text-sm bg-yellow-500 text-white rounded-lg px-3 py-1.5 hover:bg-yellow-600 disabled:opacity-50 transition-colors"
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSave('publish')}
              disabled={saving}
              className="text-sm bg-black text-white rounded-lg px-3 py-1.5 hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content — 2/3 */}
        <div className="col-span-2 space-y-4">
          <input
            type="text"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Post title"
            className="w-full text-2xl font-semibold border-0 border-b border-gray-200 pb-3 focus:outline-none focus:border-gray-400 bg-transparent"
          />

          <textarea
            value={excerpt}
            onChange={e => { setExcerpt(e.target.value); scheduleAutosave() }}
            placeholder="Short excerpt / summary…"
            rows={2}
            className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />

          <RichTextEditor
            content={content}
            onChange={v => { setContent(v); scheduleAutosave() }}
            onImageUpload={handleImageUpload}
          />

          {/* Video embed */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Video URL (YouTube / Vimeo)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => { setVideoUrl(e.target.value); scheduleAutosave() }}
              placeholder="https://youtube.com/watch?v=…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="col-span-1 space-y-5">

          {/* Cover image */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Cover image</label>
            {coverImageUrl ? (
              <div className="relative group">
                <Image
                  src={coverImageUrl}
                  alt="Cover"
                  width={400}
                  height={200}
                  className="w-full h-36 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl('')}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded px-2 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <span className="text-sm text-gray-400">
                  {coverUploading ? 'Uploading…' : 'Click to upload'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={coverUploading}
                  className="hidden"
                />
              </label>
            )}
            <input
              type="url"
              value={coverImageUrl}
              onChange={e => setCoverImageUrl(e.target.value)}
              placeholder="or paste image URL"
              className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black">
              <span className="text-xs text-gray-400 px-2">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={e => {
                  setSlug(e.target.value)
                  setSlugManuallyEdited(true)
                }}
                className="flex-1 py-2 pr-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="">None</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* SEO */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500">SEO</p>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                placeholder={title || 'Post title'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO description</label>
              <textarea
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
                placeholder={excerpt || 'Meta description…'}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{seoDescription.length}/160</p>
            </div>
          </div>

          {/* Delete */}
          {!isNew && (
            <div className="pt-4 border-t border-gray-200">
              <DeleteButton postId={post.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [confirm, setConfirm] = useState(false)

  async function handleDelete() {
    await supabase.from('posts').delete().eq('id', postId)
    router.push('/dashboard')
    router.refresh()
  }

  if (!confirm) {
    return (
      <button
        type="button"
        onClick={() => setConfirm(true)}
        className="text-xs text-red-500 hover:text-red-700 transition-colors"
      >
        Delete post
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Are you sure?</span>
      <button
        type="button"
        onClick={handleDelete}
        className="text-xs text-red-600 font-medium hover:text-red-800"
      >
        Delete
      </button>
      <button
        type="button"
        onClick={() => setConfirm(false)}
        className="text-xs text-gray-400 hover:text-gray-600"
      >
        Cancel
      </button>
    </div>
  )
}
