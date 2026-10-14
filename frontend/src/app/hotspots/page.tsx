import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export const metadata: Metadata = { title: "Hotspot satelit" };
export default function HotspotsPage() { return <ModulePlaceholder href="/hotspots" />; }
