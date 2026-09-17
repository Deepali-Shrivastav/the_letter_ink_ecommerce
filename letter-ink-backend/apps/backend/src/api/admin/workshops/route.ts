import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WORKSHOP_MODULE } from "../../../modules/workshop"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const [workshops, count] = await workshopModuleService.listAndCountWorkshops()
    res.json({
      workshops,
      count,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const data = req.body as any

    if (!data.title) {
      return res.status(400).json({ message: "Title is required" })
    }

    const handle = data.handle || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4)
    const price = typeof data.price === "number" ? data.price : parseFloat(data.price) || 0
    let images = data.images
    if (typeof images === "string") {
      images = [images]
    }

    const payload = {
      title: data.title,
      handle,
      description: data.description || "",
      date: data.date || "",
      time: data.time || "",
      venue: data.venue || "",
      level: data.level || "",
      price,
      spots_text: data.spots_text || "",
      kit_info: data.kit_info || "",
      images: images || [],
      status: data.status || "published",
    }

    const workshop = await workshopModuleService.createWorkshops(payload)
    res.status(201).json({
      workshop,
    })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const { id } = req.query as { id: string }
    if (!id) {
      return res.status(400).json({ message: "Workshop ID is required" })
    }

    await workshopModuleService.deleteWorkshops([id])
    res.json({ id, object: "workshop", deleted: true })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
