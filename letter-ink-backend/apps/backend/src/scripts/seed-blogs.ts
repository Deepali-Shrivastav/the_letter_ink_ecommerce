import { ExecArgs } from "@medusajs/framework/types"
import BlogModuleService from "../modules/blog/service"
import { BLOG_MODULE } from "../modules/blog"

export default async function seedBlogs({ container }: ExecArgs) {
  const blogModuleService: BlogModuleService = container.resolve(BLOG_MODULE)

  const blogsToCreate = [
    {
      title: "The Alchemy of 24k Gold Flakes & Oak Gall Ink on Deckle-Edge Cotton Rag",
      handle: "preserving-glass-engraving",
      description: "Exploring how hand-ground iron gall formulas interact with 300 GSM Indian handmade khadi paper, and the unwavering patience required for genuine copperplate swells under natural monsoonal humidity.",
      content: "<p>In an age of luminous screens and ephemeral text, a bride and groom’s vows committed to archival cotton paper become the singular physical heirloom passed down through generations.</p>",
      author: "By Master Scribe",
      category: "Archival Wisdom",
      read_time: "8 Min Read",
      publish_date: "Oct 24, 2024",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuC5p9YKXHZ_lFyC5fabjVhtgxLBLRCQcdBhRu7__0dUd54R2fRwX-iUZlv_fPppvH28Tb7ueh1hXUEbm1H2KK9h4cqVa5U-H68QVPG1FPORvdvMV1P3r7oueyMKHZOV1I6nJtk9WOphSF50fnm-K6YJyCaifhQc-zuHVwbazpjGMUn4c47R1oidIlSxKhoxKG5r9oDA0zKKhiJJjr5JmGBdbEsz7HR7HjT8S3RNDOKwsR4zZ9FS-bc"],
      status: "published"
    },
    {
      title: "The Sacred Geometry of Wedding Vow Keepsakes: Why Handwritten Still Matters",
      handle: "wedding-vows-keepsake",
      description: "In an age of luminous screens and ephemeral text, a bride and groom’s vows committed to archival cotton paper become the singular physical heirloom passed down through generations.",
      content: "<p>A comprehensive conservatory guide to washing, handling, and buffering personalized glassware etched with micro-drill burs to prevent clouding and micro-fractures.</p>",
      author: "The Scribe",
      category: "Etiquette & Vows",
      read_time: "5 Min Read",
      publish_date: "Oct 18, 2024",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAXsCT-gBBWhNqL15AIEuUKKsdw7R3jN2QyoThP-BtbO7rmQ1AgSorPJAk21sY7qMinllo8tTxer0naGx-Ue41sFHaZ6YdrlYRAyx80EFisbA2QQtgOJbQ9-t_m7KHZxHpXe748s8A7DfcL54OrVp6r8m8czSO7twvAnNICp9JiYg1HVKRECj7W-LWgt6DVH6pSFZhuNafjg3gBz3fndzcQWYR3YFnSu_pnv9f52nY6_te3-VxrS2Q"],
      status: "published"
    },
    {
      title: "Preserving Glass Engraving: Caring for Hand-Etched Flutes & Victorian Crystal",
      handle: "caring-for-hand-etched-flutes",
      description: "A comprehensive conservatory guide to washing, handling, and buffering personalized glassware etched with micro-drill burs to prevent clouding and micro-fractures.",
      content: "<p>Inside our slow distillation ritual: simmering sun-dried green hulls, balancing clove oil preservatives, and calibrating gum arabic for optimal nib hairspring flow.</p>",
      author: "Glass Atelier",
      category: "Conservation",
      read_time: "4 Min Read",
      publish_date: "Oct 11, 2024",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBdyFwtW9JSQTC4CuMdNu8hiQjy1_v24mQGR7g0KQk6LUcWlPk9CCVxsVDhtAEvgD_U7qIGfRkhxFZj8zdPRJFnbUVTzewhPzqF_QcbvDyb_zpPE-gAhkvuV1lG2jtF_QZCAGyjMpJVoRIq0F7FUa6eH8Xy2HDGsRO-gG_zPO06wKNmi4ZZEd-_XSik15oN8Jnyr7k9MJT1gyANe1V_uAgTE8-u4620UrnMYUB9hobY7gVgGUwGiRY"],
      status: "published"
    }
  ]

  console.log("Seeding blog posts...")
  
  for (const b of blogsToCreate) {
    const existing = await blogModuleService.listPosts({ handle: b.handle })
    if (existing.length === 0) {
      await blogModuleService.createPosts([b] as any)
      console.log(`Created post: ${b.title}`)
    } else {
      console.log(`Post already exists: ${b.title}`)
    }
  }

  console.log("Finished seeding blogs.")
}
