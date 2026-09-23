import { z } from "zod"

export const idParamSchema = z.string().min(1).max(128)

export const handleParamSchema = z.string().min(1).max(200).regex(/^[a-zA-Z0-9\-_]+$/)

export const createWorkshopSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  handle: z.string().max(200).optional(),
  description: z.string().max(10000).optional(),
  date: z.string().max(100).optional(),
  time: z.string().max(100).optional(),
  venue: z.string().max(300).optional(),
  level: z.string().max(100).optional(),
  price: z.union([z.number().min(0), z.string().regex(/^\d+(\.\d+)?$/)]).optional(),
  spots_text: z.string().max(100).optional(),
  kit_info: z.string().max(500).optional(),
  images: z.union([z.array(z.string().url().or(z.string())), z.string()]).optional(),
  status: z.enum(["draft", "published"]).default("published"),
})

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  handle: z.string().max(200).optional(),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(1000).optional(),
  status: z.enum(["draft", "published"]).default("published"),
  published_at: z.string().optional(),
  category: z.string().max(100).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const updateBlogSchema = createBlogSchema.partial()

export const createCustomizationOptionSchema = z.object({
  product_id: z.string().min(1, "product_id is required"),
  title: z.string().min(1, "title is required").max(100),
  type: z.string().max(50).optional(),
})

export const createCustomizationValueSchema = z.object({
  option_id: z.string().min(1, "option_id is required"),
  value: z.string().min(1, "value is required").max(100),
  price_adjustment: z.number().optional(),
})

export const createCustomizationCombinationSchema = z.object({
  product_id: z.string().min(1, "product_id is required"),
  price_adjustment: z.number().optional(),
  status: z.string().optional(),
  value_ids: z.array(z.string()).optional(),
})
