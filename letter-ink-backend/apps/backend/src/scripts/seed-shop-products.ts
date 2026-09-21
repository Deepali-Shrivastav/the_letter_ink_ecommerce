import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { ProductStatus } from "@medusajs/framework/utils"

export default async function seedShopProducts({ container }: ExecArgs) {
  const query = container.resolve("query")
  const productService = container.resolve(Modules.PRODUCT)

  console.log("Checking existing products...")
  const existingProducts = await productService.listProducts({})
  console.log(`Found ${existingProducts.length} existing products.`)

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

  const productsToSeed = [
    {
      title: "Name Frame Royal Large",
      handle: "name-frame-royal-large",
      subtitle: "Shadowbox Keepsake",
      description: "Custom flourish script with 24k gold leaf illuminated accents in vintage brass float frame.",
      price: 3800,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6CVMoZTEzClzL6mBTDZFn4mIVWlWdhETun5YggvA6JKVS_wjG4gtS3CPrzGUJ8f4CCq5uH3qo1mWauANxHoo3b3V026ErVhIxis2yLb1t1aBEuEBjJwNUiBJoVyd122PeQO4F8_JlQ1Hn2DHWszWI0huoBraFkrBnuoRfjjowJRh5AvcIqCnjE4EkyOd9YIE_x_kIHxBXRccCEyu1JIYGdibIYiY3C2RSxPEVTXnl8mz1u4jBKnk",
      badge: "Bestseller",
      rating: 4.9,
      reviews: 145,
      category: "Name Frames & Wall Art",
      action: "Customize & Order"
    },
    {
      title: "Name Frame Classic Small",
      handle: "name-frame-classic-small",
      subtitle: "Desk Heirloom",
      description: "Natural oak tabletop easel frame with bespoke Spencerian name lettering on 300gsm deckle paper.",
      price: 2499,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7UJXbHe7pzwPPs4Vfom_GVG1UjRckKek6ylwgFlyLo2m5TR_PlQOWrTdGp_NqlcK3FZ5EsWp9ED7y3wVZ7e38ucLyEDKSjiPjTDUzYTbAMCgXLYYJuSHSmKxljvsDdDRWBePk0A4WhIsM_FpE3j84nbRof8yk4s8pJkNeLH7bZLyiawttAs6j-n4SQjzT-u4ugPasxi4w1TUPf7nvTlYVsDUcznVqeWu-EGTuCYSXy0_uOQrd0vI",
      badge: "Custom Name",
      rating: 4.8,
      reviews: 42,
      category: "Name Frames & Wall Art",
      action: "Order Online"
    },
    {
      title: "Name Frame Royal Small",
      handle: "name-frame-royal-small",
      subtitle: "Illuminated Keepsake",
      description: "Fine pointed pen dip ink monogram with illuminated gold foliate border in antique brass frame.",
      price: 2899,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwoMXhKow_4pVKRWIrkYYsQQnMkuevMT-nYnrNJf_nAZ0owe-KUP_2rivEyvBmwcUGWO5E-_MTjReo7lPxPvvzKgjsVxgcraMgDBmYbqQnBNlVPiKe816rofnS4YdS3iiGYxVJ3g44xSX-dx9f7jOTWyGjIHsuP24Cr6YoI24fVNrycLMnWiMUzdNa3ArWxwch4ab4UL4A8_siMnuLeDgP565xGOOYAqqTWXMyGcsa1dHagkKLzYA",
      badge: "Heirloom",
      rating: 4.9,
      reviews: 88,
      category: "Name Frames & Wall Art",
      action: "Order Online"
    },
    {
      title: "Personalised Handwritten Scroll",
      handle: "personalised-handwritten-scroll",
      subtitle: "Epistolary Suite",
      description: "Up to 150 words of poetic prose or personal wedding letters, finished with hand-dyed silk ribbon.",
      price: 3500,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI224Faozgh-Vym1P7I2kOqyaR6BcMtuf7L1LCYzLtgbQVd608HCnZtzsbvxZ2AGPo-eEM538sw-A0sZjVq06DBQjLhtPGj4ptod4UQGn_6JrPEFa7LyfEpwQb_f7qbSaayUDOgBIyr5La1Z7PWW-XWESmfX1om0eZCwVceka3wSUq79mIbIbAi9SbQ22T-32oiILdLHiU4qR8uu5hdrUicqNAdKVcLsNnhokfgi1B2w56-DhwKEU",
      badge: "Petite Gesture",
      rating: 5.0,
      reviews: 110,
      category: "Handwritten Vow Suites",
      action: "Inscribe Piece"
    },
    {
      title: "Bespoke Wedding Vow Suite",
      handle: "bespoke-wedding-vow-suite",
      subtitle: "Bridal & Ceremony",
      description: "Pair of deckle-edge vows booklets with gilded 24k gold initial lettering and genuine silk ties.",
      price: 4200,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFxG3E2BUA7Wz-CEZV9wJWmiLPTVvVWUV4It51AYY2X_jC2CaUYhNQJUB7JrPhl65bKo5wsAF-ILTLISanBy0sjt38gvLDY9oRJ2TwWdDrPlyjOt4knjMqHeMCCZ2RfAGPikddHK1pmWxLX9ZdFaSCUXBWPYURqvOPkses4O20049fnuUI0icyJ_vmG-GUoIicwOXBrwYS-pVx7mpibET3V2f8ws4yz-UGlv3Q1nAB_8W0hR8A_PU",
      badge: "Wedding Edition",
      rating: 5.0,
      reviews: 59,
      category: "Handwritten Vow Suites",
      action: "Customize & Order"
    },
    {
      title: "Enveloped Letter & Custom Wax Seal",
      handle: "enveloped-letter-and-custom-wax-seal",
      subtitle: "Personal Romance",
      description: "Archival sumi ink letter tucked inside handmade envelope with metallic stamped wax emblem.",
      price: 3200,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMF42QlIvH1iULU-0uFhjuE8PjRAch7XmMC1RHRQgRwXuKqPBOIS1fU7-gRTZKzZvcp1pDOWVHBfPMH9YYbxp4QZwd1OyFOK5wzCuGBi30vWIYGoGBgOZrShhvKm0ERzldhpDhH2eACLNg6CONAKtg4gggK-ykFgdWOH7-kpE6bVtbjqneZBnJsRUYSf5ZoUH9yo4YMIiLJ6JCHT9LR3eHQPFZr-GqDvGdOwVnd1YYUsVKOCSJuZg",
      badge: "Patron's Pick",
      rating: 4.8,
      reviews: 37,
      category: "Wax Seal & Epistolary Sets",
      action: "Order Online"
    },
    {
      title: "Engraved French Glass Box",
      handle: "engraved-french-glass-box",
      subtitle: "Monogram Glass",
      description: "Diamond micro-drill hand engraved glass keepsake with botanical wreath and intertwined initials.",
      price: 3400,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBopfdIB6wZrVKlylz5LpUmLRQtSgpYZEnqPe8uYe6Og_zpWaMMYCp8sjWfzmxMrxrg5WJ7ejfJht2GQ4gL464kwCxidvdf1LNsot0O0eLL-uRXFJx6X7oE9fjrdqs0UXbtgPy4ro6bQzm9hBQfOJxB4t8ePNM-X0RQ4JlHpI6GDedNk-Vq3ETyDbh-3opLR_6d08rsQo6a4eo7qbdRuTx3q0ZztE_VHOqAewAUQUx1ZvUdJ5xkTcg",
      badge: "Glasswork Atelier",
      rating: 4.9,
      reviews: 51,
      category: "Hand-Etched Glassware",
      action: "Order Online"
    },
    {
      title: "Personalised Champagne Flutes",
      handle: "personalised-champagne-flutes",
      subtitle: "Ceremony Glassware",
      description: "Pair of crystalline flutes individually carved with calligraphy scripts and date in keepsake box.",
      price: 3640,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDhdtPkYe3YZ0oOzbxtdBqzNpNdO8c1QV63GS-WDOa_VVLu5KjmA-2FelGahhhOlNFLkw7KG3pWWFtfZ5OyAfsqBAGMxMUIG-gRV6g2M-Ozka9YLM0zv2YXflKZvUo9NROCizgfMItl5USY4Tcc7nNVPqkrlVNw43cs4y9uhVACLiRw3Sdx9mcQwcnnTHtWJOR75Z_1KfVxpiUf92p9INM1tpxRPdhrXkZuefdRSos-ZQYqhrs29g",
      badge: "Heirloom Glass",
      rating: 4.9,
      reviews: 96,
      category: "Hand-Etched Glassware",
      action: "Order Online"
    },
    {
      title: "Wooden Monogram Wax Seal Kit",
      handle: "wooden-monogram-wax-seal-kit",
      subtitle: "Scribe & Epistolary",
      description: "Turned beechwood handle with solid brass coin, brass melting spoon, and pearlescent wax beads.",
      price: 1850,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCld6oGW-asCJkO-WxDe5ichDc7fRPBsVCSUUgxvYNhfxb60RJiPVE9HAeq4Js2aEuGEBfnvj7WbE3mLX5Yqk5Do8oRQKwqLywcp4rgUbTsknYUmj0Zml2JBXH9H6iEyPw8gTe6NRubvHrZjvsrBOs3M-xxa1B8qliMLQGzQlSALiMHCjpRAQ81Ax6BP5w2PplpHZ_UL8-lE30I1H-zUE5Xku_F_DYYBJlJ-jfC0oT8rc7w1R4wyEc",
      badge: "Calligrapher's Suite",
      rating: 4.8,
      reviews: 73,
      category: "Wax Seal & Epistolary Sets",
      action: "Order Online"
    }
  ]

  for (const item of productsToSeed) {
    const existing = existingProducts.find(p => p.handle === item.handle)
    if (existing) {
      console.log(`Product with handle "${item.handle}" already exists. Skipping.`)
      continue
    }

    console.log(`Creating product: ${item.title}...`)
    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            handle: item.handle,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfileId,
            thumbnail: item.image,
            images: [{ url: item.image }],
            metadata: {
              badge: item.badge,
              rating: item.rating,
              review_count: item.reviews,
              category_name: item.category,
              action_label: item.action
            },
            sales_channels: defaultSalesChannelId ? [{ id: defaultSalesChannelId }] : [],
            options: [
              {
                title: "Standard",
                values: ["Default"]
              }
            ],
            variants: [
              {
                title: "Default",
                options: {
                  Standard: "Default"
                },
                prices: [
                  {
                    amount: item.price,
                    currency_code: "inr"
                  }
                ]
              }
            ]
          }
        ]
      }
    })
    console.log(`Successfully created: ${item.title}`)
  }

  console.log("All shop products seeded successfully!")
}
