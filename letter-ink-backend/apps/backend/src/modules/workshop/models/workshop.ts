import { model } from "@medusajs/framework/utils"

export const Workshop = model.define("workshop", {
  id: model.id({ prefix: "wk" }).primaryKey(),
  title: model.text(),
  handle: model.text(),
  description: model.text().nullable(),
  date: model.text().nullable(),
  time: model.text().nullable(),
  venue: model.text().nullable(),
  level: model.text().nullable(),
  price: model.number().default(0),
  spots_text: model.text().nullable(),
  kit_info: model.text().nullable(),
  images: model.json().nullable(),
  status: model.text().default("published"),
})
