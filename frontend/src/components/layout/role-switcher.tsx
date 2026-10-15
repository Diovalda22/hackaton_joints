"use client";

import { useId } from "react";
import { toast } from "sonner";
import { useActor } from "@/components/providers/actor-context";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { roleLabels } from "@/lib/domain/labels";

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

/** Pilih pengguna demo. Menentukan tombol yang tampil dan token yang dipakai saat menyimpan perubahan. */
export function RoleSwitcher() {
  const { actor, users, usersStatus, setActorId } = useActor();
  const id = useId();

  if (!actor) {
    return usersStatus === "error"
      ? <span className="text-xs text-destructive">Daftar pengguna gagal dimuat</span>
      : <Skeleton className="h-9 w-32" aria-label="Memuat peran demo" />;
  }

  return (
    <div className="flex min-w-0 items-center gap-2.5 md:border-l md:pl-4">
      <span className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary md:flex" aria-hidden="true">{initials(actor.display_name)}</span>
      <div className="min-w-0">
        <label htmlFor={id} className="hidden text-[10px] leading-4 text-muted-foreground md:block">Masuk sebagai (demo)</label>
        <Select
          id={id}
          aria-label="Masuk sebagai pengguna demo"
          value={actor.id}
          onValueChange={(value) => {
            const next = users.find((user) => user.id === value);
            if (!next) return;
            setActorId(next.id);
            toast.info(`Sekarang sebagai ${next.display_name}`, { description: roleLabels[next.role] });
          }}
          className="h-9 w-auto max-w-[10.5rem] px-2 text-xs font-semibold md:max-w-[12rem]"
          options={users.map((user) => ({ value: user.id, label: user.display_name, description: roleLabels[user.role] }))}
        />
      </div>
    </div>
  );
}
