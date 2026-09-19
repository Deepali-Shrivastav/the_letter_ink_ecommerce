import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomisationModuleService from "../../../../../modules/customisation/service";
import { CUSTOMISATION_MODULE } from "../../../../../modules/customisation";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { productId } = req.params;
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);

  try {
    // 1. Get groups linked to this product
    const productGroups = await customisationService.listCustomisationProductGroups({ product_id: productId }, {
      order: { display_order: "ASC" }
    });

    if (!productGroups.length) {
      return res.json({ groups: [], text_field: null });
    }

    const groupIds = productGroups.map(pg => pg.group_id);

    // 2. Fetch the actual groups
    const groups = await customisationService.listCustomisationGroups({ id: groupIds });

    // 3. Fetch options for these groups
    const options = await customisationService.listCustomisationOptions({ group_id: groupIds, is_available: true }, {
      order: { display_order: "ASC" }
    });

    const optionIds = options.map(o => o.id);

    // 4. Fetch compatibility rules involving these options
    let compatibilityRules: any[] = [];
    if (optionIds.length) {
      compatibilityRules = await customisationService.listCustomisationCompatibilityRules({
        source_option_id: optionIds
      });
    }

    // 5. Fetch text field for this product
    const textFields = await customisationService.listCustomisationTextFields({ product_id: productId });
    const text_field = textFields.length ? textFields[0] : null;

    // Assembly
    const assembledGroups = productGroups.map(pg => {
      const group = groups.find(g => g.id === pg.group_id);
      if (!group) return null;

      const groupOptions = options.filter(o => o.group_id === group.id);
      
      // Attach compatibility targets mapped by option value
      const compRulesByValue: Record<string, string[]> = {};
      groupOptions.forEach(opt => {
        const targets = compatibilityRules
          .filter(cr => cr.source_option_id === opt.id)
          .map(cr => cr.target_option_id);
        
        if (targets.length > 0) {
          compRulesByValue[opt.value] = targets;
        }
      });

      return {
        ...group,
        display_order: pg.display_order,
        is_required: pg.is_required,
        options: groupOptions,
        compatibility_rules: Object.keys(compRulesByValue).length > 0 ? compRulesByValue : undefined
      };
    }).filter(Boolean);

    res.json({
      groups: assembledGroups,
      text_field
    });
  } catch (error) {
    console.error("Error fetching product customisation:", error);
    res.status(500).json({ error: "Failed to fetch customisation config" });
  }
}
