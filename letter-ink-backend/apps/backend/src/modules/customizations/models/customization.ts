import { model } from "@medusajs/framework/utils"

export const CustomizationOption = model.define("customization_option", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  title: model.text(), // e.g. "Ink Color"
  values: model.hasMany(() => CustomizationOptionValue, { mappedBy: "option" })
})

export const CustomizationOptionValue = model.define("customization_option_value", {
  id: model.id().primaryKey(),
  value: model.text(), // e.g. "Black"
  option: model.belongsTo(() => CustomizationOption, { mappedBy: "values" }),
  combinations: model.manyToMany(() => CustomizationCombination, { mappedBy: "values" })
})

export const CustomizationCombination = model.define("customization_combination", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  status: model.enum(["active", "disabled"]).default("active"),
  preview_image_url: model.text().nullable(),
  price_adjustment: model.number().nullable(),
  values: model.manyToMany(() => CustomizationOptionValue)
})
