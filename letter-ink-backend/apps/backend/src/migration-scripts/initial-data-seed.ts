import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["in"];

  logger.info("Seeding store data for The Letter Ink...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Default Sales Channel",
          description: "The Letter Ink Primary Sales Channel",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "The Letter Ink Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  logger.info("Seeding store currency and details...");
  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "The Letter Ink",
          supported_currencies: [
            {
              currency_code: "inr",
              is_default: true,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding India region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding India region.");

  logger.info("Seeding India tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "The Letter Ink Studio",
          address: {
            city: "Bangalore",
            country_code: "IN",
            address_1: "Indiranagar",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "The Letter Ink Studio Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India",
        geo_zones: [
          {
            country_code: "in",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Delivery (India)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivers in 3-5 business days across India.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 150,
          },
          {
            region_id: region.id,
            amount: 150,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Studio Courier",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Priority studio packing with 24-48h dispatch.",
          code: "express",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 350,
          },
          {
            region_id: region.id,
            amount: 350,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding collections for The Letter Ink...");
  const { result: collectionsResult } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: [
        {
          title: "Hampers",
          handle: "hampers",
        },
        {
          title: "Signature Series",
          handle: "signature-series",
        },
      ],
    },
  });
  const hampersCollection = collectionsResult.find((c) => c.handle === "hampers");

  logger.info("Seeding product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Name Frames & Wall Art",
          handle: "name-frames-and-wall-art",
          is_active: true,
        },
        {
          name: "Bespoke Stationery",
          handle: "bespoke-stationery",
          is_active: true,
        },
        {
          name: "Wax Seals & Atelier Kits",
          handle: "wax-seals-and-atelier-kits",
          is_active: true,
        },
        {
          name: "Gifting Hampers",
          handle: "gifting-hampers",
          is_active: true,
        },
      ],
    },
  });

  const nameFramesCat = categoryResult.find((cat) => cat.name === "Name Frames & Wall Art")!;
  const stationeryCat = categoryResult.find((cat) => cat.name === "Bespoke Stationery")!;
  const waxSealsCat = categoryResult.find((cat) => cat.name === "Wax Seals & Atelier Kits")!;
  const hampersCat = categoryResult.find((cat) => cat.name === "Gifting Hampers")!;

  logger.info("Seeding product options...");
  const { result: productOptionsResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        {
          title: "Frame Size",
          values: ["Small (8x10)", "Large (12x16)"],
        },
      ],
    },
  });
  const frameSizeOption = productOptionsResult.find((o) => o.title === "Frame Size")!;

  logger.info("Seeding Letter Ink products in INR...");
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Name Frame Royal Large",
          subtitle: "Shadowbox Keepsake",
          category_ids: [nameFramesCat.id],
          description:
            "Custom flourish calligraphy with 24k gold leaf illuminated accents in vintage brass float frame.",
          handle: "name-frame-royal-large",
          weight: 1200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6CVMoZTEzClzL6mBTDZFn4mIVWlWdhETun5YggvA6JKVS_wjG4gtS3CPrzGUJ8f4CCq5uH3qo1mWauANxHoo3b3V026ErVhIxis2yLb1t1aBEuEBjJwNUiBJoVyd122PeQO4F8_JlQ1Hn2DHWszWI0huoBraFkrBnuoRfjjowJRh5AvcIqCnjE4EkyOd9YIE_x_kIHxBXRccCEyu1JIYGdibIYiY3C2RSxPEVTXnl8mz1u4jBKnk",
            },
          ],
          options: [{ id: frameSizeOption.id }],
          variants: [
            {
              title: "Large (12x16)",
              sku: "NF-ROYAL-LG",
              options: {
                "Frame Size": "Large (12x16)",
              },
              prices: [
                {
                  amount: 3800,
                  currency_code: "inr",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Name Frame Classic Small",
          subtitle: "Desk Heirloom",
          category_ids: [nameFramesCat.id],
          description:
            "Natural oak tabletop easel frame with bespoke Spencerian name lettering on 300gsm deckle paper.",
          handle: "name-frame-classic-small",
          weight: 600,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7UJXbHe7pzwPPs4Vfom_GVG1UjRckKek6ylwgFlyLo2m5TR_PlQOWrTdGp_NqlcK3FZ5EsWp9ED7y3wVZ7e38ucLyEDKSjiPjTDUzYTbAMCgXLYYJuSHSmKxljvsDdDRWBePk0A4WhIsM_FpE3j84nbRof8yk4s8pJkNeLH7bZLyiawttAs6j-n4SQjzT-u4ugPasxi4w1TUPf7nvTlYVsDUcznVqeWu-EGTuCYSXy0_uOQrd0vI",
            },
          ],
          options: [{ id: frameSizeOption.id }],
          variants: [
            {
              title: "Small (8x10)",
              sku: "NF-CLASSIC-SM",
              options: {
                "Frame Size": "Small (8x10)",
              },
              prices: [
                {
                  amount: 2499,
                  currency_code: "inr",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Vintage Brass Wax Seal Kit",
          subtitle: "Atelier Sealing Suite",
          category_ids: [waxSealsCat.id],
          description:
            "Monogram engraved solid brass wax stamp, melting spoon, kiln-dried rosewood handle, and 3 sticks of flexible mailable sealing wax.",
          handle: "vintage-brass-wax-seal-kit",
          weight: 450,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCKiJttLURVgb2TsqApuCWY1BQxNARNFc_beK291Av1LF3Qz8x9GDyxV1unnQM22ZgSgMGQjTjW7QxF7SnhTH1MQtEtSW6KrtDOVxaTWVOpGVw3OG16_JNnEx4BFVb2g2omOASWyHVA9tKocgMNDWEfoKyX4DufIXkseapu4f03aI2aQ9T1rIumB7Gc8TBJ6d_RIJG52hFKowNsDPAb6lUeXVPjanUt3Q-OUfL-XV-gBe57HxGUkM",
            },
          ],
          variants: [
            {
              title: "Default Kit",
              sku: "SEAL-KIT-01",
              prices: [
                {
                  amount: 1850,
                  currency_code: "inr",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Artisanal Keepsake Gift Hamper",
          subtitle: "Bespoke Hamper Chest",
          collection_id: hampersCollection?.id,
          category_ids: [hampersCat.id],
          description:
            "Handcrafted pine wood presentation box containing an engraved glass perfume vial, custom monogrammed journal, brass wax seal kit, and personalized scroll.",
          handle: "artisanal-keepsake-gift-hamper",
          weight: 2500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200",
            },
          ],
          variants: [
            {
              title: "Full Hamper Box",
              sku: "HAMPER-CHEST-01",
              prices: [
                {
                  amount: 4999,
                  currency_code: "inr",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
      ],
    },
  });

  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  if (inventoryItems.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryItems.map((item) => ({
          location_id: stockLocation.id,
          stocked_quantity: 1000,
          inventory_item_id: item.id,
        })),
      },
    });
  }

  logger.info("The Letter Ink initial data seed completed successfully!");
}
