import Image from "next/image"
import type { Post } from "@threetone/db"
import { VideoEmbed } from "./VideoEmbed"

export function PostContent({ post }: { post: Post }) {
  return (
    <>
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
          {new Date(post.published_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
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
    </>
  )
}
