import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export const metadata: Metadata = { title: "Eksperimen ML" };
export default function MLPage() { return <ModulePlaceholder href="/experiments/ml" />; }
