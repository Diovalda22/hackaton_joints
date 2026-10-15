import Link from "next/link";
import { cn } from "@/components/ui/utils";

export function Brand({ compact = false, onNavigate, href = "/dashboard", label = "GambutOps — ke Ringkasan" }: { compact?: boolean; onNavigate?: () => void; href?: string; label?: string }) {
  return (
    <Link href={href} onClick={onNavigate} aria-label={label} className={cn("flex w-fit items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", compact && "mx-auto")}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
        <svg viewBox="0 0 32 32" fill="none" className="size-7" aria-hidden="true">
          <path d="M16 4C12 10 7 14 7 20a9 9 0 0 0 18 0c0-6-5-10-9-16Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M11 20c4 0 5-6 10-6-1 7-5 10-10 6Zm0 0 8-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && <span><span className="block text-[21px] font-bold tracking-tight">Gambut<span className="text-primary">Ops</span></span><span className="block whitespace-nowrap text-[10px] font-medium tracking-[0.08em] text-muted-foreground">CEGAH · DETEKSI · TINDAK</span></span>}
    </Link>
  );
}
