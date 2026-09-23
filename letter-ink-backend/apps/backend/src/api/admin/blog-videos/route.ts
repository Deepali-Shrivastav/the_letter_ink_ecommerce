import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"
import { isStudioVideo, postToBlogVideo, blogVideoToPostPayload } from "../../common/blog-video-helper"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const posts = await blogModuleService.listPosts({}, {
      order: { created_at: "ASC" },
    })

    const videos = (posts || [])
      .filter(isStudioVideo)
      .map(postToBlogVideo)

    res.json({ videos })
  } catch (err: any) {
    logger?.error?.("Failed to list studio videos (admin):", err)
    res.status(500).json({ message: "Failed to retrieve studio videos", videos: [] })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const body = req.body as any
    if (!body.title) {
      res.status(400).json({ message: "Title is required" })
      return
    }

    const payload = blogVideoToPostPayload(body)
    const post = await blogModuleService.createPosts(payload as any)
    const video = postToBlogVideo(post)

    res.status(201).json({ video })
  } catch (err: any) {
    logger?.error?.("Failed to create studio video (admin):", err)
    res.status(500).json({ message: "Failed to create studio video: " + (err.message || String(err)) })
  }
}
