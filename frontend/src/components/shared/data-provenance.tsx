import { Database, Clock3 } from "lucide-react";
import { DemoBadge } from "./demo-badge";

function displayTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak valid";
  return `${new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta",
  }).format(date)} WIB`;
}

export function DataProvenance({ sourceName, observedAt = null, observedDate = null, simulation = true }: {
  sourceName: string; observedAt?: string | null; observedDate?: string | null; simulation?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5"><Database className="size-3.5" aria-hidden="true" />{sourceName}</span>
      <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" />
        {observedAt ? <time dateTime={observedAt}>{displayTime(observedAt)}</time> : observedDate ? <time dateTime={observedDate}>{observedDate} · pengamatan harian</time> : "Waktu pengamatan belum tersedia"}
      </span>
      {simulation && <DemoBadge />}
    </div>
  );
}
