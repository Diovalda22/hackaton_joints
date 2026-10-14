"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
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

const subscribe = () => () => {};

interface GuideContextValue {
  openGuide: (tab?: GuideTab) => void;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export function GuideProvider({ children }: { children: ReactNode }) {
  // Server menganggap panduan sudah dilihat agar HTML awal sama; klien membaca localStorage.
  const seen = useSyncExternalStore(subscribe, readSeen, () => true);
  const [dismissed, setDismissed] = useState(false);
  const [manual, setManual] = useState<{ open: boolean; tab: GuideTab }>({ open: false, tab: "start" });

  const firstVisit = !seen && !dismissed;
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
