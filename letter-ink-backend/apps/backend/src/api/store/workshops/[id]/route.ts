import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WORKSHOP_MODULE } from "../../../../modules/workshop"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const workshop = await workshopModuleService.retrieveWorkshop(id)
    res.json({
      workshop,
    })
  } catch (err: any) {
    res.status(404).json({ message: "Workshop not found" })
  }
}
