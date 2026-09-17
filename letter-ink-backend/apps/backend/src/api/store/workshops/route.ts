import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WORKSHOP_MODULE } from "../../../modules/workshop"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const workshopModuleService = req.scope.resolve(WORKSHOP_MODULE)

  try {
    const [workshops, count] = await workshopModuleService.listAndCountWorkshops(
      req.filterableFields || {},
      req.queryConfig || {}
    )

    res.json({
      workshops,
      count,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
