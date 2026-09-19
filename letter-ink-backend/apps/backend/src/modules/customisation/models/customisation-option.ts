import { model } from "@medusajs/framework/utils"

const CustomisationOption = model.define("customisation_option", {
  id: model.id().primaryKey(),
  label: model.text(),
  value: model.text(),
  color_hex: model.text().nullable(),
  is_light_color: model.boolean().default(false),
  display_order: model.number().default(0),
  is_available: model.boolean().default(true),
  group_id: model.text(),
})

export default CustomisationOption
