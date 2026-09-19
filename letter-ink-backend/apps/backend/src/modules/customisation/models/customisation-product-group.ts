import { model } from "@medusajs/framework/utils"

const CustomisationProductGroup = model.define("customisation_product_group", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  group_id: model.text(),
  display_order: model.number().default(0),
  is_required: model.boolean().default(false),
})

export default CustomisationProductGroup
