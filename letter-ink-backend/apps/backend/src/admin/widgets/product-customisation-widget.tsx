import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { sdk } from "../lib/sdk"; // Using generic admin sdk if exists, or standard fetch

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

const ProductCustomisationWidget = ({ product }: { product: any }) => {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    // Basic fetch logic to hit our new customisation API
    fetch(`/admin/customisation/products/${product.id}`, {
      headers: {
        // Assume auth handled by medusa admin middleware
      }
    })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.error("Error fetching customisation info:", err));
  }, [product.id]);

  return (
    <Container className="p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-large font-semibold">Product Customisation (Atelier)</h2>
        <p className="text-ui-fg-subtle text-small">
          Manage the customisation groups linked to this product. 
          Use the Customisation tab in the sidebar to create groups and options.
        </p>
        
        {data?.product_groups?.length > 0 ? (
          <div className="flex flex-col gap-2 mt-4">
            <h3 className="text-base font-medium">Linked Groups:</h3>
            <ul className="list-disc pl-5">
              {data.product_groups.map((pg: any) => (
                <li key={pg.id} className="text-small">
                  Group ID: {pg.group_id} (Order: {pg.display_order})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 text-small text-ui-fg-muted">
            No customisation groups are linked to this product yet.
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductCustomisationWidget;
