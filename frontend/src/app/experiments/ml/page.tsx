import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export const metadata: Metadata = { title: "Uji prediksi" };
export default function MLPage() { return <ModulePlaceholder href="/experiments/ml" />; }
