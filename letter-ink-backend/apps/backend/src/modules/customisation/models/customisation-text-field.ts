import { model } from "@medusajs/framework/utils"

const CustomisationTextField = model.define("customisation_text_field", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  label: model.text(),
  placeholder: model.text(),
  max_chars: model.number().default(120),
  is_required: model.boolean().default(false),
})

export default CustomisationTextField
