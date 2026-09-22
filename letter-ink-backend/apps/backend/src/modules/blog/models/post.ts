import { model } from "@medusajs/framework/utils"

export const Post = model.define("post", {
  id: model.id({ prefix: "post" }).primaryKey(),
  title: model.text(),
  handle: model.text(),
  description: model.text().nullable(),
  content: model.text().nullable(),
  author: model.text().nullable(),
  category: model.text().nullable(),
  read_time: model.text().nullable(),
  publish_date: model.text().nullable(),
  images: model.json().nullable(),
  status: model.text().default("published"),
})
