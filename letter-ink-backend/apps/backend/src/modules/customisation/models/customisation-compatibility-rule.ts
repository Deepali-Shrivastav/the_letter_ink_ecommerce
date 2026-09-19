import { model } from "@medusajs/framework/utils"

const CustomisationCompatibilityRule = model.define("customisation_compatibility_rule", {
  id: model.id().primaryKey(),
  source_option_id: model.text(),
  target_option_id: model.text(),
})

export default CustomisationCompatibilityRule
