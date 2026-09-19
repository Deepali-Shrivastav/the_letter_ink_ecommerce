import { MedusaContainer } from "@medusajs/framework/types";
import { CUSTOMISATION_MODULE } from "../modules/customisation";
import CustomisationModuleService from "../modules/customisation/service";
import { Modules } from "@medusajs/framework/utils";
import { IProductModuleService } from "@medusajs/framework/types";

export default async function seedCustomisationData({ container }: { container: MedusaContainer }) {
  console.log("Starting customisation seed...");
  
  const customisationService: CustomisationModuleService = container.resolve(CUSTOMISATION_MODULE);
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT);

  // 1. Create Groups
  const paperGroup = await customisationService.createCustomisationGroups({ 
    name: "Paper Color", type: "swatch", display_order: 1, is_required: true 
  });
  const inkGroup = await customisationService.createCustomisationGroups({ 
    name: "Ink Color", type: "swatch", display_order: 2, is_required: true 
  });
  const fontGroup = await customisationService.createCustomisationGroups({ 
    name: "Font Style", type: "chip", display_order: 3, is_required: true 
  });

  console.log("Created customisation groups.");

  // 2. Create Paper Options
  const blackVelvet = await customisationService.createCustomisationOptions({ 
    label: "Black Velvet", value: "black-velvet", color_hex: "#1a1a1a", is_light_color: false, display_order: 1, group_id: paperGroup.id 
  });
  const claret = await customisationService.createCustomisationOptions({ 
    label: "Claret", value: "claret", color_hex: "#722F37", is_light_color: false, display_order: 2, group_id: paperGroup.id 
  });
  const ecru = await customisationService.createCustomisationOptions({ 
    label: "Ecru", value: "ecru", color_hex: "#C2B280", is_light_color: true, display_order: 3, group_id: paperGroup.id 
  });

  // 3. Create Ink Options
  const silverSparkle = await customisationService.createCustomisationOptions({ 
    label: "Silver Sparkle", value: "silver-sparkle", color_hex: "#C0C0C0", is_light_color: true, display_order: 1, group_id: inkGroup.id 
  });
  const gold = await customisationService.createCustomisationOptions({ 
    label: "Gold", value: "gold", color_hex: "#FFD700", is_light_color: true, display_order: 2, group_id: inkGroup.id 
  });
  const blackInk = await customisationService.createCustomisationOptions({ 
    label: "Black", value: "black", color_hex: "#000000", is_light_color: false, display_order: 3, group_id: inkGroup.id 
  });

  // 4. Create Font Options
  await customisationService.createCustomisationOptions({ 
    label: "Copperplate", value: "copperplate", display_order: 1, group_id: fontGroup.id 
  });
  await customisationService.createCustomisationOptions({ 
    label: "Spencerian", value: "spencerian", display_order: 2, group_id: fontGroup.id 
  });

  console.log("Created customisation options.");

  // 5. Create Compatibility Rules
  // Black Velvet -> Silver Sparkle, Gold
  await customisationService.createCustomisationCompatibilityRules({ source_option_id: blackVelvet.id, target_option_id: silverSparkle.id });
  await customisationService.createCustomisationCompatibilityRules({ source_option_id: blackVelvet.id, target_option_id: gold.id });
  
  // Claret -> Gold
  await customisationService.createCustomisationCompatibilityRules({ source_option_id: claret.id, target_option_id: gold.id });
  
  // Ecru -> Black Ink, Gold
  await customisationService.createCustomisationCompatibilityRules({ source_option_id: ecru.id, target_option_id: blackInk.id });
  await customisationService.createCustomisationCompatibilityRules({ source_option_id: ecru.id, target_option_id: gold.id });

  console.log("Created compatibility rules.");

  // 6. Link to Product "name-frame-royal-large"
  const products = await productService.listProducts({ handle: "name-frame-royal-large" });
  if (products.length > 0) {
    const product = products[0];
    await customisationService.createCustomisationProductGroups({ product_id: product.id, group_id: paperGroup.id, display_order: 1, is_required: true });
    await customisationService.createCustomisationProductGroups({ product_id: product.id, group_id: inkGroup.id, display_order: 2, is_required: true });
    await customisationService.createCustomisationProductGroups({ product_id: product.id, group_id: fontGroup.id, display_order: 3, is_required: true });
    
    await customisationService.createCustomisationTextFields({ 
      product_id: product.id, 
      label: "Custom Name", 
      placeholder: "Write the name to be scripted...", 
      max_chars: 120, 
      is_required: true 
    });

    console.log(`Linked customisation groups to product ${product.handle}`);
  } else {
    console.log("Product 'name-frame-royal-large' not found. Skipping product link.");
  }

  console.log("Customisation seed completed successfully!");
}
