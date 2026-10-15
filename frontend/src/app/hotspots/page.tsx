import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/shared/module-placeholder";
import { AreaOverviewSection } from "@/components/maps/area-overview-section";

export const metadata: Metadata = { title: "Titik panas" };
export default function HotspotsPage() { return <ModulePlaceholder href="/hotspots" preview={<AreaOverviewSection />} />; }
