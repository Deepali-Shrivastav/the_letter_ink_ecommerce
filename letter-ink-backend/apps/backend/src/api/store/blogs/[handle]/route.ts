import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../../modules/blog/service"
import { BLOG_MODULE } from "../../../../modules/blog"
import { handleParamSchema } from "../../../common/validation"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = handleParamSchema.safeParse(req.params.handle)
  if (!validation.success) {
    res.status(400).json({ message: "Invalid blog handle" })
    return
  }

  const handle = validation.data
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  try {
    const posts = await blogModuleService.listPosts({
      handle: handle,
      status: "published"
    })

    if (!posts || posts.length === 0) {
      res.status(404).json({ message: "Blog not found" })
      return
    }

    res.json({ blog: posts[0] })
  } catch (err: any) {
    logger?.error?.(`Failed to retrieve blog post with handle ${handle}:`, err)
    res.status(500).json({ message: "Failed to retrieve blog post" })
  }
}
