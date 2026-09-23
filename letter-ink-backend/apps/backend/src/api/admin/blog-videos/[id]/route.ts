import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../../modules/blog/service"
import { BLOG_MODULE } from "../../../../modules/blog"
import { postToBlogVideo, blogVideoToPostPayload } from "../../../common/blog-video-helper"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const { id } = req.params
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const post = await blogModuleService.retrievePost(id)
    if (!post) {
      res.status(404).json({ message: "Studio video not found" })
      return
    }
    res.json({ video: postToBlogVideo(post) })
  } catch (err: any) {
    logger?.error?.(`Failed to retrieve studio video ${id}:`, err)
    res.status(404).json({ message: "Studio video not found" })
  }
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const { id } = req.params
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const body = req.body as any
    const payload = blogVideoToPostPayload(body)

    const updated = await blogModuleService.updatePosts({
      id,
      ...payload,
    })

    res.json({ video: postToBlogVideo(updated) })
  } catch (err: any) {
    logger?.error?.(`Failed to update studio video ${id}:`, err)
    res.status(500).json({ message: "Failed to update studio video: " + (err.message || String(err)) })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const { id } = req.params
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    await blogModuleService.deletePosts([id])
    res.json({ id, object: "blog_video", deleted: true })
  } catch (err: any) {
    logger?.error?.(`Failed to delete studio video ${id}:`, err)
    res.status(500).json({ message: "Failed to delete studio video: " + (err.message || String(err)) })
  }
}
