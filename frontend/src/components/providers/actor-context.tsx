"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { User } from "@/types";
import { useUsers } from "./data-hooks";

const ACTOR_KEY = "gambutops:demo-actor:v1";
const CHANGE_EVENT = "gambutops:demo-actor-change";

function readStoredActorId(): string | null {
  try {
    return window.localStorage.getItem(ACTOR_KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

interface ActorContextValue {
  /** Pengguna demo yang sedang dipakai; null selama daftar pengguna dimuat atau gagal. */
  actor: User | null;
  users: readonly User[];
  usersStatus: "idle" | "loading" | "success" | "error";
  setActorId: (id: string) => void;
}

const ActorContext = createContext<ActorContextValue | null>(null);

/**
 * Peran demo yang sedang ditampilkan (koordinator atau petugas). Pada REST, peran ini memilih
 * Bearer token; identitas final tetap ditentukan server dari token tersebut.
 */
export function ActorProvider({ children }: { children: ReactNode }) {
  const users = useUsers();
  const storedId = useSyncExternalStore(subscribe, readStoredActorId, () => null);
  const list = useMemo(() => users.data ?? [], [users.data]);
  const actor = list.find((user) => user.id === storedId) ?? list.find((user) => user.role === "coordinator") ?? list[0] ?? null;

  const setActorId = useCallback((id: string) => {
    try {
      window.localStorage.setItem(ACTOR_KEY, id);
    } catch {
      // Penyimpanan diblokir: pilihan tetap berlaku sampai halaman dimuat ulang.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ actor, users: list, usersStatus: users.status, setActorId }), [actor, list, users.status, setActorId]);
  return <ActorContext.Provider value={value}>{children}</ActorContext.Provider>;
}

export function useActor(): ActorContextValue {
  const value = useContext(ActorContext);
  if (!value) throw new Error("useActor membutuhkan ActorProvider.");
  return value;
}
