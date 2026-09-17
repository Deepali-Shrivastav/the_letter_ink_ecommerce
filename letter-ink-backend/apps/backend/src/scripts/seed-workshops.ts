import { ExecArgs } from "@medusajs/framework/types"
import { WORKSHOP_MODULE } from "../modules/workshop"

export default async function seedWorkshopsScript({ container }: ExecArgs) {
  console.log("Seeding workshops into custom Workshop Module...")
  const workshopModuleService = container.resolve(WORKSHOP_MODULE)

  try {
    const existing = await workshopModuleService.listWorkshops()
    if (existing.length > 0) {
      console.log(`Workshops already exist (${existing.length}). Skipping seed.`)
      return
    }

    const defaultWorkshops = [
      {
        title: "Bespoke Calligraphy Masterclass",
        handle: "bespoke-calligraphy-masterclass",
        description: "Join us for an immersive 3-hour hands-on session where you'll master Copperplate script basics, ink consistency, and flourishing techniques.",
        date: "Saturday, Oct 14, 2026",
        time: "10:00 AM - 1:00 PM",
        venue: "The Letter Ink Studio, Indiranagar, Bangalore",
        level: "Beginner to Intermediate",
        price: 4500,
        spots_text: "Limited to 12 seats",
        kit_info: "Full professional calligraphy kit included (nib, holder, ink, practice pad)",
        images: [
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200"
        ],
        status: "published",
      }
    ]

    for (const workshop of defaultWorkshops) {
      const created = await workshopModuleService.createWorkshops(workshop)
      console.log(`Created Workshop: ${created.title} (${created.id})`)
    }
  } catch (error) {
    console.error("Error seeding workshops:", error)
  }
}
