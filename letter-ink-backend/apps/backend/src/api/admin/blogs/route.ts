import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"
import { createBlogSchema } from "../../common/validation"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = createBlogSchema.safeParse(req.body)
  if (!validation.success) {
    res.status(400).json({
      message: "Invalid blog data",
      errors: validation.error.flatten().fieldErrors,
    })
    return
  }

  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const post = await blogModuleService.createPosts(validation.data as any)
    res.status(201).json({ blog: post })
  } catch (err: any) {
    logger?.error?.("Failed to create blog post:", err)
    res.status(500).json({ message: "Failed to create blog post" })
  }
}

import { isStudioVideo } from "../../common/blog-video-helper"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const posts = await blogModuleService.listPosts({}, {
      order: { created_at: "DESC" }
    })
    const articles = (posts || []).filter(p => !isStudioVideo(p))
    res.json({ blogs: articles })
  } catch (err: any) {
    logger?.error?.("Failed to list blog posts (admin):", err)
    res.status(500).json({ message: "Failed to retrieve blog posts" })
  }
}
