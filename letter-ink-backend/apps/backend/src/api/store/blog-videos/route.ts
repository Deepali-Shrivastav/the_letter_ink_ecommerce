import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"
import { isStudioVideo, postToBlogVideo } from "../../common/blog-video-helper"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  const { category } = req.query as { category?: string }

  try {
    const posts = await blogModuleService.listPosts({ status: "published" }, {
      order: { created_at: "ASC" },
    })

    let videos = (posts || [])
      .filter(isStudioVideo)
      .map(postToBlogVideo)

    if (category && category !== "all") {
      videos = videos.filter(v => v.category === category)
    }

    res.json({ videos })
  } catch (err: any) {
    logger?.error?.("Failed to list studio videos (store):", err)
    res.status(500).json({ message: "Failed to retrieve studio videos", videos: [] })
  }
}
