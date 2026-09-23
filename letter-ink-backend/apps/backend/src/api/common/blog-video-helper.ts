export interface BlogVideoItem {
  id: string
  title: string
  handle: string
  video_url: string
  thumbnail_url: string
  format: "portrait" | "landscape" | "still"
  category: "reels" | "shorts" | "stills"
  badge: string
  duration: string
  views: string
  caption: string
  created_at?: string
  status: string
}

export const VIDEO_CATEGORIES = ["reels", "shorts", "stills"]

export function isStudioVideo(post: any): boolean {
  if (!post) return false
  if (VIDEO_CATEGORIES.includes(post.category)) return true
  if (post.images && typeof post.images === "object" && !Array.isArray(post.images) && post.images.video_url) {
    return true
  }
  return false
}

export function postToBlogVideo(post: any): BlogVideoItem {
  const imagesData = post.images && typeof post.images === "object" && !Array.isArray(post.images) ? post.images : {}
  const video_url = imagesData.video_url || (typeof post.content === "string" && (post.content.startsWith("http") || post.content.includes(".mp4") || post.content.includes("static/")) ? post.content : "")
  
  let thumbnail_url = imagesData.thumbnail_url || ""
  if (!thumbnail_url && Array.isArray(post.images) && post.images.length > 0) {
    thumbnail_url = typeof post.images[0] === "string" ? post.images[0] : post.images[0]?.url || ""
  }

  const format: "portrait" | "landscape" | "still" = imagesData.format || (post.category === "shorts" ? "landscape" : post.category === "stills" ? "still" : "portrait")
  const badge = imagesData.badge || post.author || (format === "landscape" ? "Studio Cinema" : format === "still" ? "Macro Study" : "Process Reel")
  const duration = imagesData.duration || post.read_time || ""
  const views = imagesData.views || post.publish_date || ""
  const caption = post.description || imagesData.caption || ""

  return {
    id: post.id,
    title: post.title || "",
    handle: post.handle || "",
    video_url,
    thumbnail_url,
    format,
    category: (post.category as any) || "reels",
    badge,
    duration,
    views,
    caption,
    created_at: post.created_at,
    status: post.status || "published",
  }
}

export function blogVideoToPostPayload(data: Partial<BlogVideoItem>) {
  const format = data.format || "portrait"
  const category = data.category || (format === "landscape" ? "shorts" : format === "still" ? "stills" : "reels")
  const handle = data.handle || (data.title || "video").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4)

  return {
    title: data.title || "Untitled Video",
    handle,
    description: data.caption || "",
    content: data.video_url || "",
    author: data.badge || (format === "landscape" ? "Studio Cinema" : format === "still" ? "Macro Study" : "Process Reel"),
    category,
    read_time: data.duration || "",
    publish_date: data.views || "",
    images: {
      video_url: data.video_url || "",
      thumbnail_url: data.thumbnail_url || "",
      format,
      badge: data.badge || "",
      duration: data.duration || "",
      views: data.views || "",
      caption: data.caption || "",
    },
    status: data.status || "published",
  }
}
