import { model } from "@medusajs/framework/utils"

const CustomisationGroup = model.define("customisation_group", {
  id: model.id().primaryKey(),
  name: model.text(),
  type: model.enum(["swatch", "chip", "text"]),
  display_order: model.number().default(0),
  is_required: model.boolean().default(false),
})

export default CustomisationGroup
