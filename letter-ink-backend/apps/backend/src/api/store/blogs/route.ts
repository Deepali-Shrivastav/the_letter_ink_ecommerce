import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"

import { isStudioVideo } from "../../common/blog-video-helper"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  
  try {
    const posts = await blogModuleService.listPosts({
      status: "published"
    }, {
      order: { created_at: "DESC" }
    })

    const articles = (posts || []).filter(p => !isStudioVideo(p))

    res.json({ blogs: articles })
  } catch (err: any) {
    logger?.error?.("Failed to list published blog posts:", err)
    res.status(500).json({ message: "Failed to retrieve blog posts" })
  }
}
