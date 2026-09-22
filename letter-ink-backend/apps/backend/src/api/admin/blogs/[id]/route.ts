import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../../modules/blog/service"
import { BLOG_MODULE } from "../../../../modules/blog"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const id = req.params.id
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const post = await blogModuleService.retrievePost(id)
  res.json({ blog: post })
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const id = req.params.id
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const post = await blogModuleService.updatePosts({
    id,
    ...(req.body as any)
  })

  res.json({ blog: post })
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const id = req.params.id
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  await blogModuleService.deletePosts([id])

  res.json({ id, object: "post", deleted: true })
}
