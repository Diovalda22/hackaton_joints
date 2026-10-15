import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GambutOps — Cegah, Deteksi, Tindak", template: "%s | GambutOps" },
  description: "Prototipe pemantauan lahan gambut: muka air tanah, titik panas satelit, prioritas pemeriksaan, dan tugas lapangan yang dapat ditelusuri.",
  robots: { index: false, follow: false },
};

/** Layout akar hanya memuat dokumen; landing dan aplikasi punya layout sendiri. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
