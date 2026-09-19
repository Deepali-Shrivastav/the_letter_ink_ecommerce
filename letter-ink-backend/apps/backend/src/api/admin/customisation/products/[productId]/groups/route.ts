import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CUSTOMISATION_MODULE } from "../../../../../modules/customisation";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const remoteQuery = req.scope.resolve("remoteQuery");
  const query = remoteQuery({
    product: {
      __args: { id: req.params.productId },
      customisation_group: {
        fields: ["id", "name", "type", "display_order", "is_required", "options.*"]
      }
    }
  });
  
  const { data } = await query;
  const groups = data[0]?.customisation_group || [];
  res.json({ groups });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const link = req.scope.resolve("link");
  const { group_id } = req.body as any;
  
  await link.create({
    [Modules.PRODUCT]: { product_id: req.params.productId },
    [CUSTOMISATION_MODULE]: { customisation_group_id: group_id }
  });
  
  res.json({ success: true });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const link = req.scope.resolve("link");
  const { group_id } = req.body as any;
  
  await link.dismiss({
    [Modules.PRODUCT]: { product_id: req.params.productId },
    [CUSTOMISATION_MODULE]: { customisation_group_id: group_id }
  });
  
  res.json({ success: true });
}
