"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";

/**
 * Halaman aplikasi hanya tampil setelah masuk. Ini pengalaman pengguna, bukan keamanan:
 * perubahan data tetap diperiksa server melalui Bearer token.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session !== null) return;
    const next = `${pathname}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [pathname, router, session]);

  if (!session) {
    return (
      <div role="status" aria-live="polite" className="flex min-h-dvh items-center justify-center bg-background px-4 text-sm text-muted-foreground">
        {session === null ? "Mengalihkan ke halaman masuk…" : "Memeriksa sesi…"}
      </div>
    );
  }
  return children;
}
