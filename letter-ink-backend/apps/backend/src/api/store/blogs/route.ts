import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  
  const posts = await blogModuleService.listPosts({
    status: "published"
  }, {
    order: { created_at: "DESC" }
  })

  res.json({ blogs: posts })
}
