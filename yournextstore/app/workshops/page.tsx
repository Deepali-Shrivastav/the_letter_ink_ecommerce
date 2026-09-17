import type { Metadata } from "next";
import { WorkshopsClient } from "@/components/sections/workshops-client";

export const metadata: Metadata = {
	title: "Artisanal Calligraphy Masterclasses & Studio Workshops",
	description:
		"Step inside our world of slow lettering. Pointed pen fundamentals, advanced flourishing, wax seal crafting, and glass engraving hosted in Maharashtra and live virtually worldwide.",
};

export default function WorkshopsPage() {
	return <WorkshopsClient />;
}
