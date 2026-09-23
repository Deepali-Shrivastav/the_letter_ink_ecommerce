import { ExecArgs } from "@medusajs/framework/types"
import BlogModuleService from "../modules/blog/service"
import { BLOG_MODULE } from "../modules/blog"

export default async function clearMockVideos({ container }: ExecArgs) {
  const blogModuleService: BlogModuleService = container.resolve(BLOG_MODULE)

  const handles = [
    "video-gold-leaf-gouache-slowmo",
    "still-sumi-ink-capillary-action",
    "video-copperplate-capital-a-flourishing",
    "video-drilling-monograms-perfume-flutes",
    "still-daily-scribe-arsenal",
    "video-48-hours-bhusawal-atelier",
    "video-melting-forest-sage-beeswax",
    "still-illuminated-wedding-vows-silk",
    "video-packing-royal-bespoke-name-frame",
  ]

  const existing = await blogModuleService.listPosts({
    handle: handles,
  })

  if (existing.length > 0) {
    const ids = existing.map((p) => p.id)
    await blogModuleService.deletePosts(ids)
    console.log(`Successfully deleted ${ids.length} mock studio videos.`)
  } else {
    console.log("No mock studio videos found.")
  }
}
