import Link from "next/link";
import { ArrowUpRight, CircleDashed, Check, ShieldCheck, Link2 } from "lucide-react";
import { navigation } from "@/components/layout/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MonitoringContextPanel } from "./monitoring-context-panel";

export function ModulePlaceholder({ href }: { href: string }) {
  const item = navigation.find((entry) => entry.href === href);
  if (!item) throw new Error(`Route modul tidak terdaftar: ${href}`);
  const Icon = item.icon;
  const dashboard = href === "/dashboard";

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl"><p className="text-[10px] font-semibold tracking-[0.17em] text-teal">{item.eyebrow.toUpperCase()}</p><h1 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">{item.title}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p></div>
        <Badge variant="outline" className="mt-1">F0 · FONDASI</Badge>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
        <Card className="flex flex-col overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-teal to-secondary" />
          <CardHeader className="gap-4 p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3"><span className="flex size-12 items-center justify-center rounded-xl border border-primary/10 bg-secondary"><Icon className="size-6 text-primary" aria-hidden="true" /></span><Badge variant="outline">{item.phase} · TAHAP BERIKUTNYA</Badge></div>
            <div><CardTitle className="text-xl">{dashboard ? "Navigasi siap. Pemantauan menyusul." : "Modul akan tersedia pada fase " + item.phase}</CardTitle><CardDescription className="mt-2">{dashboard ? "Jelajahi struktur aplikasi dan ubah mode pemantauan. Ringkasan operasional akan dihubungkan ke mock provider pada F1.1." : "Route dan konteks mode sudah tersedia. Interaksi operasional berikut akan dibangun pada tahap modul ini."}</CardDescription></div>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-7 sm:pb-7">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">TERSEDIA PADA {item.phase}</p>
            <ul className="space-y-3">{item.capabilities.map((capability) => <li key={capability} className="flex items-start gap-2.5 text-sm leading-6"><CircleDashed className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span>{capability}</span></li>)}</ul>
          </CardContent>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t bg-muted/40 px-5 py-3.5 text-xs text-muted-foreground sm:px-7"><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" aria-hidden="true" />Navigasi tersedia</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" aria-hidden="true" />Mode dapat diubah</span><span className="flex items-center gap-1.5"><Link2 className="size-3.5" aria-hidden="true" />Integrasi provider menunggu branch data</span></div>
        </Card>
        <MonitoringContextPanel />
      </div>

      {dashboard && (
        <section id="modul" aria-labelledby="module-list-title" className="scroll-mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 id="module-list-title" className="text-base font-semibold">Modul operasional</h2><span className="text-xs text-muted-foreground">Implementasi bertahap · F1.2–F1.6</span></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {navigation.filter((entry) => entry.href !== "/dashboard").map((entry) => {
              const ModuleIcon = entry.icon;
              return (
                <Link key={entry.href} href={entry.href} className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/35 hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-teal"><ModuleIcon className="size-[18px]" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{entry.label}</h3><p className="mt-1 text-xs text-muted-foreground">{entry.phase} · Menunggu implementasi</p></div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex items-start gap-3 rounded-lg border border-primary/15 bg-secondary/40 p-4 text-xs leading-5">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p><span className="font-semibold text-primary">Keputusan yang dapat ditelusuri.</span> Prioritas pemeriksaan bersifat heuristik. Data yang kurang tidak berarti kondisi aman; sumber, waktu, dan batasan data akan disertakan pada setiap modul.</p>
      </div>
    </div>
  );
}
