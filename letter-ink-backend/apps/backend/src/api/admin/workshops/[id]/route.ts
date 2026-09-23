import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import WorkshopModuleService from "../../../../modules/workshop/service"
import { WORKSHOP_MODULE } from "../../../../modules/workshop"
import { idParamSchema, updateWorkshopSchema } from "../../../common/validation"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = idParamSchema.safeParse(req.params.id)
  if (!validation.success) {
    res.status(400).json({ message: "Invalid workshop identifier" })
    return
  }

  const id = validation.data
  const workshopModuleService: WorkshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const workshop = await workshopModuleService.retrieveWorkshop(id)
    if (!workshop) {
      res.status(404).json({ message: "Workshop not found" })
      return
    }
    res.json({ workshop })
  } catch (err: any) {
    logger?.error?.(`Failed to retrieve workshop ${id}:`, err)
    res.status(404).json({ message: "Workshop not found" })
  }
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const idValidation = idParamSchema.safeParse(req.params.id)
  if (!idValidation.success) {
    res.status(400).json({ message: "Invalid workshop identifier" })
    return
  }

  const bodyValidation = updateWorkshopSchema.safeParse(req.body)
  if (!bodyValidation.success) {
    res.status(400).json({
      message: "Invalid update data",
      errors: bodyValidation.error.flatten().fieldErrors,
    })
    return
  }

  const id = idValidation.data
  const workshopModuleService: WorkshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const payload: Record<string, any> = { id, ...bodyValidation.data }
    if (payload.price !== undefined) {
      payload.price = typeof payload.price === "number" ? payload.price : parseFloat(String(payload.price)) || 0
    }
    if (payload.images !== undefined && typeof payload.images === "string") {
      payload.images = [payload.images]
    }

    const workshop = await workshopModuleService.updateWorkshops(payload as any)
    res.json({ workshop })
  } catch (err: any) {
    logger?.error?.(`Failed to update workshop ${id}:`, err)
    res.status(500).json({ message: "Failed to update workshop" })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = idParamSchema.safeParse(req.params.id)
  if (!validation.success) {
    res.status(400).json({ message: "Invalid workshop identifier" })
    return
  }

  const id = validation.data
  const workshopModuleService: WorkshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    await workshopModuleService.deleteWorkshops([id])
    res.json({ id, object: "workshop", deleted: true })
  } catch (err: any) {
    logger?.error?.(`Failed to delete workshop ${id}:`, err)
    res.status(500).json({ message: "Failed to delete workshop" })
  }
}
