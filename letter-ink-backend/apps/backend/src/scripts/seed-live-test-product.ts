import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { ProductStatus } from "@medusajs/framework/utils"
import { CUSTOMIZATIONS_MODULE } from "../modules/customizations"

export default async function seedLiveTestProduct({ container }: ExecArgs) {
  const query = container.resolve("query")
  const productService = container.resolve(Modules.PRODUCT)
  const customizationService = container.resolve(CUSTOMIZATIONS_MODULE)

  console.log("Checking if product already exists...")
  const handle = "grand-royal-illuminated-monogram-float-frame"
  const existingProducts = await productService.listProducts({ handle })

  if (existingProducts.length > 0) {
    console.log(`Product with handle "${handle}" already exists. Deleting it to re-seed cleanly...`)
    for (const p of existingProducts) {
      await productService.deleteProducts([p.id])
    }
  }

  // Get shipping profile
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfileId = shippingProfiles[0]?.id
  console.log("Using shippingProfileId:", shippingProfileId)

  // Get sales channels
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  })
  const defaultSalesChannelId = salesChannels[0]?.id
  console.log("Using defaultSalesChannelId:", defaultSalesChannelId)

  // High quality atelier images for combinations
  const images = [
    { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6CVMoZTEzClzL6mBTDZFn4mIVWlWdhETun5YggvA6JKVS_wjG4gtS3CPrzGUJ8f4CCq5uH3qo1mWauANxHoo3b3V026ErVhIxis2yLb1t1aBEuEBjJwNUiBJoVyd122PeQO4F8_JlQ1Hn2DHWszWI0huoBraFkrBnuoRfjjowJRh5AvcIqCnjE4EkyOd9YIE_x_kIHxBXRccCEyu1JIYGdibIYiY3C2RSxPEVTXnl8mz1u4jBKnk" },
    { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwoMXhKow_4pVKRWIrkYYsQQnMkuevMT-nYnrNJf_nAZ0owe-KUP_2rivEyvBmwcUGWO5E-_MTjReo7lPxPvvzKgjsVxgcraMgDBmYbqQnBNlVPiKe816rofnS4YdS3iiGYxVJ3g44xSX-dx9f7jOTWyGjIHsuP24Cr6YoI24fVNrycLMnWiMUzdNa3ArWxwch4ab4UL4A8_siMnuLeDgP565xGOOYAqqTWXMyGcsa1dHagkKLzYA" },
    { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7UJXbHe7pzwPPs4Vfom_GVG1UjRckKek6ylwgFlyLo2m5TR_PlQOWrTdGp_NqlcK3FZ5EsWp9ED7y3wVZ7e38ucLyEDKSjiPjTDUzYTbAMCgXLYYJuSHSmKxljvsDdDRWBePk0A4WhIsM_FpE3j84nbRof8yk4s8pJkNeLH7bZLyiawttAs6j-n4SQjzT-u4ugPasxi4w1TUPf7nvTlYVsDUcznVqeWu-EGTuCYSXy0_uOQrd0vI" },
    { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFxG3E2BUA7Wz-CEZV9wJWmiLPTVvVWUV4It51AYY2X_jC2CaUYhNQJUB7JrPhl65bKo5wsAF-ILTLISanBy0sjt38gvLDY9oRJ2TwWdDrPlyjOt4knjMqHeMCCZ2RfAGPikddHK1pmWxLX9ZdFaSCUXBWPYURqvOPkses4O20049fnuUI0icyJ_vmG-GUoIicwOXBrwYS-pVx7mpibET3V2f8ws4yz-UGlv3Q1nAB_8W0hR8A_PU" }
  ]

  const dimensions = ["8x10 Imperial", "12x16 Royal Grandeur"]
  const finishes = ["Antiqued Patina Brass", "Heritage Walnut Shadowbox", "Polished 24K Gold Leaf"]
  const scripts = ["Flourished Spencerian", "Classical Copperplate"]

  const priceMatrix: Record<string, number> = {
    // 8x10 Imperial
    "8x10 Imperial | Antiqued Patina Brass | Flourished Spencerian": 3200,
    "8x10 Imperial | Antiqued Patina Brass | Classical Copperplate": 3450,
    "8x10 Imperial | Heritage Walnut Shadowbox | Flourished Spencerian": 3650,
    "8x10 Imperial | Heritage Walnut Shadowbox | Classical Copperplate": 3900,
    "8x10 Imperial | Polished 24K Gold Leaf | Flourished Spencerian": 4300,
    "8x10 Imperial | Polished 24K Gold Leaf | Classical Copperplate": 4550,

    // 12x16 Royal Grandeur
    "12x16 Royal Grandeur | Antiqued Patina Brass | Flourished Spencerian": 4900,
    "12x16 Royal Grandeur | Antiqued Patina Brass | Classical Copperplate": 5200,
    "12x16 Royal Grandeur | Heritage Walnut Shadowbox | Flourished Spencerian": 5400,
    "12x16 Royal Grandeur | Heritage Walnut Shadowbox | Classical Copperplate": 5750,
    "12x16 Royal Grandeur | Polished 24K Gold Leaf | Flourished Spencerian": 6400,
    "12x16 Royal Grandeur | Polished 24K Gold Leaf | Classical Copperplate": 6800,
  }

  const variants: any[] = []

  for (const dim of dimensions) {
    for (const finish of finishes) {
      for (const script of scripts) {
        const key = `${dim} | ${finish} | ${script}`
        const price = priceMatrix[key] || 3500
        const skuDim = dim.startsWith("8") ? "8X10" : "12X16"
        const skuFinish = finish.includes("Brass") ? "BRS" : finish.includes("Walnut") ? "WLN" : "GLD"
        const skuScript = script.includes("Spencerian") ? "SPN" : "CPP"
        const sku = `TLI-ROYAL-${skuDim}-${skuFinish}-${skuScript}`

        variants.push({
          title: `${dim} / ${finish} / ${script}`,
          sku,
          manage_inventory: false,
          allow_backorder: true,
          options: {
            "Dimension": dim,
            "Frame Finish": finish,
            "Script Style": script,
          },
          prices: [
            {
              amount: price,
              currency_code: "inr",
            },
          ],
        })
      }
    }
  }

  console.log(`Creating product with ${variants.length} variant combinations...`)

  const { result: createdProducts } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Grand Royal Illuminated Monogram Float Frame",
          subtitle: "24K Gold Leaf & Archival Double-Glass Heirloom",
          description:
            "An atelier masterpiece crafted for celebratory milestones, luxury weddings, and family heirlooms. Hand-lettered by master scribes on 350gsm deckle-edge cotton rag paper, illuminated with genuine 24-karat gold leaf foliate flourishes, and encased within double-paned archival float glass.",
          handle,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          thumbnail: images[0].url,
          images,
          metadata: {
            badge: "Atelier Masterpiece",
            category_name: "Name Frames & Wall Art",
            customizable: true,
            action_label: "Customize & Order",
            artisan_note: "Individually scripted with archival sumi ink and pure 24K gold leaf illumination.",
          },
          sales_channels: defaultSalesChannelId ? [{ id: defaultSalesChannelId }] : [],
          options: [
            {
              title: "Dimension",
              values: dimensions,
            },
            {
              title: "Frame Finish",
              values: finishes,
            },
            {
              title: "Script Style",
              values: scripts,
            },
          ],
          variants,
        },
      ],
    },
  })

  const newProduct = createdProducts[0]
  console.log("Created Medusa Product ID:", newProduct.id)

  // Seed Customization Module Options & Combinations for this product
  console.log("Seeding bespoke Customization Module options & combinations...")
  try {
    const sealMotifOpt = await customizationService.createCustomizationOptions({
      product_id: newProduct.id,
      title: "Wax Seal Motif",
    })

    const sealColorOpt = await customizationService.createCustomizationOptions({
      product_id: newProduct.id,
      title: "Wax Seal Tint",
    })

    const motifVal1 = await customizationService.createCustomizationOptionValues({
      option_id: sealMotifOpt.id,
      value: "Royal Monogram Crest",
    })
    const motifVal2 = await customizationService.createCustomizationOptionValues({
      option_id: sealMotifOpt.id,
      value: "Botanical Olive Wreath",
    })

    const colorVal1 = await customizationService.createCustomizationOptionValues({
      option_id: sealColorOpt.id,
      value: "Venetian Crimson",
    })
    const colorVal2 = await customizationService.createCustomizationOptionValues({
      option_id: sealColorOpt.id,
      value: "Antique Gold Lustre (+₹200)",
    })
    const colorVal3 = await customizationService.createCustomizationOptionValues({
      option_id: sealColorOpt.id,
      value: "Deep Emerald Wax (+₹150)",
    })

    // Create combinations
    await customizationService.createCustomizationCombinations({
      product_id: newProduct.id,
      status: "active",
      preview_image_url: images[0].url,
      price_adjustment: 0,
      values: [motifVal1.id, colorVal1.id],
    })

    await customizationService.createCustomizationCombinations({
      product_id: newProduct.id,
      status: "active",
      preview_image_url: images[1].url,
      price_adjustment: 200,
      values: [motifVal1.id, colorVal2.id],
    })

    await customizationService.createCustomizationCombinations({
      product_id: newProduct.id,
      status: "active",
      preview_image_url: images[2].url,
      price_adjustment: 150,
      values: [motifVal2.id, colorVal3.id],
    })

    console.log("Customization module options and combinations successfully seeded!")
  } catch (err: any) {
    console.warn("Customization module seed notice:", err?.message || err)
  }

  console.log("Grand Royal Illuminated Monogram Float Frame successfully seeded!")
}
