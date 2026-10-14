import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GambutOps — Cegah, Deteksi, Tindak", template: "%s | GambutOps" },
  description: "Versi uji coba pemantauan lahan gambut, titik panas satelit, dan koordinasi pemeriksaan lapangan.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body><AppProviders><AppShell>{children}</AppShell></AppProviders></body></html>;
}
