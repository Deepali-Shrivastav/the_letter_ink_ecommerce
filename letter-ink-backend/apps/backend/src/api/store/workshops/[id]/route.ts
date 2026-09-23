import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WORKSHOP_MODULE } from "../../../../modules/workshop"
import { idParamSchema } from "../../../common/validation"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = idParamSchema.safeParse(req.params.id)
  if (!validation.success) {
    return res.status(400).json({ message: "Invalid workshop identifier" })
  }

  const id = validation.data
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const workshop = await workshopModuleService.retrieveWorkshop(id)
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" })
    }
    res.json({
      workshop,
    })
  } catch (err: any) {
    logger?.error?.(`Failed to retrieve workshop ${id}:`, err)
    res.status(404).json({ message: "Workshop not found" })
  }
}
