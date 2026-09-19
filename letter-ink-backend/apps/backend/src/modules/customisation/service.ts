import { MedusaService } from "@medusajs/framework/utils"
import CustomisationGroup from "./models/customisation-group"
import CustomisationOption from "./models/customisation-option"
import CustomisationTextField from "./models/customisation-text-field"
import CustomisationProductGroup from "./models/customisation-product-group"
import CustomisationCompatibilityRule from "./models/customisation-compatibility-rule"

class CustomisationModuleService extends MedusaService({
  CustomisationGroup,
  CustomisationOption,
  CustomisationTextField,
  CustomisationProductGroup,
  CustomisationCompatibilityRule,
}) {}

export default CustomisationModuleService
