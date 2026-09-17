import { MedusaService } from "@medusajs/framework/utils"
import { Workshop } from "./models/workshop"

class WorkshopModuleService extends MedusaService({
  Workshop,
}) {}

export default WorkshopModuleService
