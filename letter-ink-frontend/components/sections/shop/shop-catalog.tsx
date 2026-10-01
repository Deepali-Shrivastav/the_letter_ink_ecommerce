/**
 * ShopCatalog — Server Component shell
 *
 * Wraps the data-fetching layer (ShopCatalogInner) in a Suspense
 * boundary so the skeleton shows while Medusa responds.
 *
 * Component tree:
 *   ShopCatalog (Server)
 *     └─ <Suspense fallback={<ShopCatalogSkeleton />}>
 *          └─ <ShopCatalogInner /> (async Server, fetches from Medusa)
 *               └─ <ShopCatalogClient products={…} /> (Client, filter/sort state)
 */
import { Suspense } from "react";
import { ShopCatalogInner } from "./shop-catalog-inner";
import { ShopCatalogSkeleton } from "./shop-catalog-skeleton";

export function ShopCatalog() {
	return (
		<Suspense fallback={<ShopCatalogSkeleton count={6} />}>
			<ShopCatalogInner />
		</Suspense>
	);
}
