import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { addToCartWorkflow } from "@medusajs/medusa/core-flows";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const { variant_id, quantity, unit_price, metadata, title } = req.body as any;

  try {
    const item: any = {
      quantity,
      metadata: {
        ...(metadata || {}),
        ...(variant_id ? { custom_variant_id: variant_id } : {})
      },
    };

    if (variant_id && variant_id.startsWith("wk_")) {
      const workshopService = req.scope.resolve("workshopModuleService") as any;
      if (workshopService) {
        const workshop = await workshopService.retrieveWorkshop(variant_id);
        if (workshop) {
          item.unit_price = workshop.price;
        } else {
          return res.status(404).json({ success: false, error: "Workshop not found" });
        }
      } else {
        return res.status(500).json({ success: false, error: "Workshop module unavailable" });
      }
      item.title = title || metadata?.title || "Workshop Seat";
    } else {
      item.variant_id = variant_id;
      // Do NOT set item.unit_price here. This forces the Medusa core 
      // addToCartWorkflow to look up the correct price securely from the DB.
    }

    const { result } = await addToCartWorkflow(req.scope).run({
      input: {
        cart_id: id,
        items: [item],
      },
    });

    res.status(200).json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
