import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export const metadata: Metadata = { title: "Tugas & verifikasi" };
export default function TasksPage() { return <ModulePlaceholder href="/tasks" />; }
