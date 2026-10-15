import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, CircleDashed, ShieldCheck } from "lucide-react";
import { navigation } from "@/components/layout/navigation";
import { GuideButton } from "@/components/guide/guide-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MonitoringContextPanel } from "./monitoring-context-panel";

const quickStart = [
  { title: "Pilih jenis data", text: "Riwayat atau Terkini, di bagian atas layar." },
  { title: "Atur periode dan wilayah", text: "Di panel Data yang ditampilkan." },
  { title: "Buka menu", text: "Mulai dari Muka air tanah yang sudah siap dipakai." },
];

/** `preview` menampilkan bagian yang sudah bisa dipakai di bawah kartu "sedang disiapkan". */
export function ModulePlaceholder({ href, preview }: { href: string; preview?: ReactNode }) {
  const item = navigation.find((entry) => entry.href === href);
  if (!item) throw new Error(`Route modul tidak terdaftar: ${href}`);
  const Icon = item.icon;
  const dashboard = href === "/dashboard";

  return (
    <div className="space-y-7">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal">{item.eyebrow}</p>
        <h1 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">{item.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>

      {dashboard && (
        <section aria-labelledby="quick-start-title" className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="quick-start-title" className="text-base font-semibold">Mulai dari sini</h2>
            <GuideButton tab="steps" variant="outline" size="sm">Lihat panduan lengkap</GuideButton>
          </div>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {quickStart.map((step, index) => (
              <li key={step.title} className="flex gap-3 rounded-lg bg-muted/60 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-card text-sm font-semibold text-primary" aria-hidden="true">{index + 1}</span>
                <div><p className="text-sm font-medium">{step.title}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{step.text}</p></div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {dashboard && (
        <section id="modul" aria-labelledby="module-list-title" className="scroll-mt-6">
          <h2 id="module-list-title" className="mb-4 text-base font-semibold">Pilih menu</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {navigation.filter((entry) => entry.href !== "/dashboard").sort((a, b) => Number(b.available) - Number(a.available)).map((entry) => {
              const ModuleIcon = entry.icon;
              return (
                <Link key={entry.href} href={entry.href} className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors duration-150 hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-teal"><ModuleIcon className="size-[18px]" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{entry.label}</h3>
                    {entry.available
                      ? <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium leading-5 text-primary"><span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />Siap dipakai</p>
                      : <p className="mt-1 text-xs leading-5 text-muted-foreground">{entry.experimental ? "Uji coba · segera tersedia" : "Segera tersedia"}</p>}
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="gap-4 p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3"><span className="flex size-12 items-center justify-center rounded-xl border border-primary/10 bg-secondary"><Icon className="size-6 text-primary" aria-hidden="true" /></span><Badge variant="outline">Segera tersedia</Badge></div>
            <div>
              <CardTitle className="text-xl">{dashboard ? "Ringkasan sedang disiapkan" : "Halaman ini sedang disiapkan"}</CardTitle>
              <CardDescription className="mt-2">Sementara itu, Anda sudah bisa mengganti jenis data, mengatur periode dan wilayah, serta membaca panduan.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-7 sm:pb-7">
            <h3 className="mb-3 text-sm font-medium">Nanti di halaman ini Anda bisa:</h3>
            <ul className="space-y-3">{item.capabilities.map((capability) => <li key={capability} className="flex items-start gap-2.5 text-sm leading-6"><CircleDashed className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span>{capability}</span></li>)}</ul>
          </CardContent>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40 px-5 py-3.5 sm:px-7">
            <span className="text-xs text-muted-foreground">Belum tahu harus mulai dari mana?</span>
            <GuideButton tab="steps" variant="ghost" size="sm">Buka panduan</GuideButton>
          </div>
        </Card>
        {/* Di layar kecil, panel pengaturan tampil lebih dulu agar langkah "atur periode" langsung terlihat. */}
        <div className="order-first xl:order-none"><MonitoringContextPanel /></div>
      </div>

      {preview}

      <div className="flex items-start gap-3 rounded-lg border border-primary/15 bg-secondary/40 p-4 text-sm leading-6">
        <ShieldCheck className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p><span className="font-semibold text-primary">Bisa ditelusuri.</span> Setiap prioritas akan disertai alasan, sumber, dan waktu datanya. Data yang kurang bukan berarti aman.</p>
      </div>
    </div>
  );
}
