import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export const metadata: Metadata = { title: "Tugas lapangan" };
export default function TasksPage() { return <ModulePlaceholder href="/tasks" />; }
