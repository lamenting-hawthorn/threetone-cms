export function VideoEmbed({ url }: { url: string }) {
  let embedUrl = url

  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
  }

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
