import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GambutOps — Prevent, Detect, Act", template: "%s | GambutOps" },
  description: "Prototype DEMO pemantauan gambut, anomali panas, dan koordinasi pemeriksaan. F0 — fondasi frontend.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body><AppProviders><AppShell>{children}</AppShell></AppProviders></body></html>;
}
