import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../../modules/blog/service"
import { BLOG_MODULE } from "../../../../modules/blog"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const handle = req.params.handle
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const posts = await blogModuleService.listPosts({
    handle: handle,
    status: "published"
  })

  if (!posts || posts.length === 0) {
    res.status(404).json({ message: "Blog not found" })
    return
  }

  res.json({ blog: posts[0] })
}
