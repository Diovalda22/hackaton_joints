"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { GuideDialog, type GuideTab } from "./guide-dialog";

const SEEN_KEY = "gambutops:guide-seen:v1";

function readSeen(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Penyimpanan diblokir: jangan memaksa panduan muncul di setiap halaman.
    return true;
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Abaikan; panduan tetap bisa ditutup untuk sesi ini.
  }
}

/** Jalankan setelah halaman selesai dimuat dan browser senggang. */
function afterPageSettles(callback: () => void): () => void {
  let idleId: number | undefined;
  let timeoutId: number | undefined;
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(callback, { timeout: 1500 });
    else timeoutId = window.setTimeout(callback, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  };
}

interface GuideContextValue {
  openGuide: (tab?: GuideTab) => void;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export function GuideProvider({ children }: { children: ReactNode }) {
  // Panduan otomatis baru dibuka setelah seluruh halaman selesai hydrate. Dialog Radix menandai
  // elemen lain `aria-hidden`; bila terbuka lebih awal, HTML server dan klien tidak lagi sama.
  const [firstVisitPending, setFirstVisitPending] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [manual, setManual] = useState<{ open: boolean; tab: GuideTab }>({ open: false, tab: "start" });

  useEffect(() => {
    if (readSeen()) return;
    return afterPageSettles(() => setFirstVisitPending(true));
  }, []);

  const firstVisit = firstVisitPending && !dismissed;
  const open = manual.open || firstVisit;

  // Panduan dibuka tanpa DialogTrigger, jadi elemen pembuka dicatat agar fokus bisa dikembalikan.
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openGuide = useCallback((tab: GuideTab = "start") => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setManual({ open: true, tab });
  }, []);

  function restoreFocus(event: Event) {
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (!target?.isConnected) return;
    event.preventDefault();
    target.focus();
  }

  function handleOpenChange(next: boolean) {
    if (next) return;
    markSeen();
    setDismissed(true);
    setManual((current) => ({ ...current, open: false }));
  }

  const value = useMemo(() => ({ openGuide }), [openGuide]);

  return (
    <GuideContext.Provider value={value}>
      {children}
      <GuideDialog open={open} onOpenChange={handleOpenChange} initialTab={firstVisit ? "start" : manual.tab} firstVisit={firstVisit} onCloseAutoFocus={restoreFocus} />
    </GuideContext.Provider>
  );
}

export function useGuide(): GuideContextValue {
  const value = useContext(GuideContext);
  if (!value) throw new Error("useGuide membutuhkan GuideProvider.");
  return value;
}
