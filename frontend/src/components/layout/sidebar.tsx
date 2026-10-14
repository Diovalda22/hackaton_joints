"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { navigation } from "./navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";

export function SidebarContent({ pathname, compact = false, onNavigate, onToggle }: {
  pathname: string; compact?: boolean; onNavigate?: () => void; onToggle?: () => void;
}) {
  return (
    <>
      <div className={cn("flex h-24 shrink-0 items-center border-b px-6", compact && "px-0")}><Brand compact={compact} onNavigate={onNavigate} /></div>
      <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-7", compact && "px-3")}>
        <p className={cn("mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground", compact && "sr-only")}>RUANG KERJA</p>
        <nav aria-label="Navigasi utama" className="space-y-1.5">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} title={compact ? item.label : undefined}
                className={cn("group flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground", compact && "justify-center px-0")}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                <span className={cn("flex-1", compact && "sr-only")}>{item.label}</span>
                {!compact && item.href === "/experiments/ml" && <span aria-hidden="true" className="rounded border border-border px-1.5 py-0.5 text-[9px]">P1</span>}
                {!compact && active && item.href !== "/experiments/ml" && <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>
        {!compact && (
          <div className="mt-auto pt-10 pb-5">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /><Badge variant="outline">F0</Badge></div>
              <p className="mt-3 text-sm font-semibold">Fondasi prototype</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Navigasi dan konteks siap. Modul operasional dibangun bertahap.</p>
              <Link href="/dashboard#modul" onClick={onNavigate} className="mt-3 inline-flex items-center gap-1.5 rounded text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Lihat tahap berikutnya<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
            </div>
          </div>
        )}
      </div>
      <div className={cn("flex min-h-16 shrink-0 items-center justify-between gap-2 border-t px-6 py-3", compact && "justify-center px-0")}>
        {!compact && <span className="text-[10px] tracking-wide text-muted-foreground">JOINTS HACKATHON 2026</span>}
        {onToggle && <Button variant="ghost" size="icon" onClick={onToggle} aria-label={compact ? "Perluas sidebar" : "Ciutkan sidebar"} aria-expanded={!compact} aria-controls="desktop-sidebar-nav">{compact ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}</Button>}
      </div>
    </>
  );
}
