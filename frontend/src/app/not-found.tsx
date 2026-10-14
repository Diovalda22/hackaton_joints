import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/async-states";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <div className="space-y-5"><EmptyState title="Halaman tidak ditemukan" description="Alamat ini belum tersedia di GambutOps. Kembali ke dashboard untuk memilih modul." /><Button asChild variant="outline"><Link href="/dashboard"><ArrowLeft aria-hidden="true" />Kembali ke dashboard</Link></Button></div>;
}
