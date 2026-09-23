import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../../modules/blog/service"
import { BLOG_MODULE } from "../../../../modules/blog"
import { idParamSchema, updateBlogSchema } from "../../../common/validation"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = idParamSchema.safeParse(req.params.id)
  if (!validation.success) {
    res.status(400).json({ message: "Invalid blog identifier" })
    return
  }

  const id = validation.data
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const post = await blogModuleService.retrievePost(id)
    if (!post) {
      res.status(404).json({ message: "Blog post not found" })
      return
    }
    res.json({ blog: post })
  } catch (err: any) {
    logger?.error?.(`Failed to retrieve blog post ${id}:`, err)
    res.status(404).json({ message: "Blog post not found" })
  }
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const idValidation = idParamSchema.safeParse(req.params.id)
  if (!idValidation.success) {
    res.status(400).json({ message: "Invalid blog identifier" })
    return
  }

  const bodyValidation = updateBlogSchema.safeParse(req.body)
  if (!bodyValidation.success) {
    res.status(400).json({
      message: "Invalid update data",
      errors: bodyValidation.error.flatten().fieldErrors,
    })
    return
  }

  const id = idValidation.data
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const post = await blogModuleService.updatePosts({
      id,
      ...bodyValidation.data
    })

    res.json({ blog: post })
  } catch (err: any) {
    logger?.error?.(`Failed to update blog post ${id}:`, err)
    res.status(500).json({ message: "Failed to update blog post" })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = idParamSchema.safeParse(req.params.id)
  if (!validation.success) {
    res.status(400).json({ message: "Invalid blog identifier" })
    return
  }

  const id = validation.data
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    await blogModuleService.deletePosts([id])
    res.json({ id, object: "post", deleted: true })
  } catch (err: any) {
    logger?.error?.(`Failed to delete blog post ${id}:`, err)
    res.status(500).json({ message: "Failed to delete blog post" })
  }
}
