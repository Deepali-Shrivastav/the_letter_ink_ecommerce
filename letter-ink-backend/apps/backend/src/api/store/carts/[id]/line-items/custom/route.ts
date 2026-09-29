import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { addToCartWorkflow } from "@medusajs/medusa/core-flows";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const { variant_id, quantity, unit_price, metadata } = req.body as any;

  try {
    const { result } = await addToCartWorkflow(req.scope).run({
      input: {
        cart_id: id,
        items: [
          {
            variant_id,
            quantity,
            unit_price, // Marks as is_custom_price: true
            metadata,
          },
        ],
      },
    });

    res.status(200).json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
