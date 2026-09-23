import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WORKSHOP_MODULE } from "../../../modules/workshop"
import { createWorkshopSchema, idParamSchema } from "../../common/validation"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const [workshops, count] = await workshopModuleService.listAndCountWorkshops()
    res.json({
      workshops,
      count,
    })
  } catch (err: any) {
    logger?.error?.("Failed to list workshops (admin):", err)
    res.status(500).json({ message: "Failed to retrieve workshops" })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = createWorkshopSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid workshop data",
      errors: validation.error.flatten().fieldErrors,
    })
  }

  const data = validation.data
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const handle = data.handle || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4)
    const price = typeof data.price === "number" ? data.price : parseFloat(String(data.price)) || 0
    const images = typeof data.images === "string" ? [data.images] : (data.images || [])

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
      images,
      status: data.status || "published",
    }

    const workshop = await workshopModuleService.createWorkshops(payload as any)
    res.status(201).json({
      workshop,
    })
  } catch (err: any) {
    logger?.error?.("Failed to create workshop:", err)
    res.status(500).json({ message: "Failed to create workshop" })
  }
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const { id } = req.query as { id?: string }
  const validation = idParamSchema.safeParse(id)
  if (!validation.success) {
    return res.status(400).json({ message: "Valid workshop ID is required" })
  }

  const validId = validation.data
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    await workshopModuleService.deleteWorkshops([validId])
    res.json({ id: validId, object: "workshop", deleted: true })
  } catch (err: any) {
    logger?.error?.(`Failed to delete workshop ${validId}:`, err)
    res.status(500).json({ message: "Failed to delete workshop" })
  }
}
