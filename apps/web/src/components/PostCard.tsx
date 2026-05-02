import Image from "next/image"
import Link from "next/link"
import type { Post } from "@threetone/db"

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group">
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
                {new Date(post.published_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
