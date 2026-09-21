import { MedusaService } from "@medusajs/framework/utils"
import { CustomizationOption, CustomizationOptionValue, CustomizationCombination } from "./models/customization"

class CustomizationsModuleService extends MedusaService({
  CustomizationOption,
  CustomizationOptionValue,
  CustomizationCombination,
}) {}

export default CustomizationsModuleService
