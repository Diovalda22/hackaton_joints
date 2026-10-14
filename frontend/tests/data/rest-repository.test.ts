import assert from "node:assert/strict";
import test from "node:test";
import { RepositoryError } from "@/lib/api/errors";
import { createRestRepository } from "@/lib/api/rest-repository";
import { CURRENT_HOTSPOTS, GROUNDWATER } from "@/lib/mock/fixtures";
import type { User } from "@/types";

const actor: User = { id: "u-coord-1", role: "coordinator", display_name: "Koordinator" };

interface Call { url: URL; init: RequestInit }

function fakeFetch(handler: (url: URL, init: RequestInit) => Response | Promise<Response>) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    calls.push({ url, init });
    return handler(url, init);
  }) as typeof fetch;
  return { calls, repo: createRestRepository({ baseUrl: "http://api.test/api/v1/", fetch: fetchImpl, today: () => "2026-10-12" }) };
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function rejectsWith(promise: Promise<unknown>, code: RepositoryError["code"]) {
  await assert.rejects(promise, (error: unknown) => error instanceof RepositoryError && error.code === code);
}

test("hotspot: query bbox/mode dikirim dan payload divalidasi", async () => {
  const { repo, calls } = fakeFetch(() => json({ mode: "CURRENT_MONITORING", items: CURRENT_HOTSPOTS.slice(0, 3), last_synced_at: "2026-10-12T08:15:00Z" }));
  const result = await repo.listHotspots({ mode: "CURRENT_MONITORING", from: "2026-10-06", to: "2026-10-12", area_id: "batanghari" });
  assert.equal(result.items.length, 3);
  const url = calls[0]!.url;
  assert.equal(url.pathname, "/api/v1/hotspots");
  assert.equal(url.searchParams.get("mode"), "CURRENT_MONITORING");
  assert.equal(url.searchParams.get("bbox"), "102.9,-2.2,104,-1.3");
});

test("hotspot dengan mode berbeda ditolak sebagai payload tidak valid", async () => {
  const mixed = [{ ...CURRENT_HOTSPOTS[0]!, mode: "HISTORICAL_REPLAY" }];
  const { repo } = fakeFetch(() => json({ mode: "CURRENT_MONITORING", items: mixed, last_synced_at: null }));
  await rejectsWith(repo.listHotspots({ mode: "CURRENT_MONITORING", from: "2026-10-06", to: "2026-10-12" }), "INVALID_PAYLOAD");
});

test("payload tidak sesuai schema → INVALID_PAYLOAD", async () => {
  const { repo } = fakeFetch(() => json([{ id: "BRG6" }]));
  await rejectsWith(repo.listStations(), "INVALID_PAYLOAD");
  const { repo: broken } = fakeFetch(() => new Response("<html>", { status: 200 }));
  await rejectsWith(broken.listStations(), "INVALID_PAYLOAD");
});

test("Current Monitoring: observasi GWT lama dari server disembunyikan", async () => {
  const old = (GROUNDWATER.get("BRG6") ?? []).slice(0, 5).map((obs) => ({ ...obs, mode: "CURRENT_MONITORING" }));
  const { repo } = fakeFetch(() => json({ station_id: "BRG6", mode: "CURRENT_MONITORING", from: "2026-10-06", to: "2026-10-12", availability: "AVAILABLE", notice: null, observations: old }));
  const series = await repo.getGroundwater({ mode: "CURRENT_MONITORING", station_id: "BRG6", from: "2026-10-06", to: "2026-10-12" });
  assert.equal(series.availability, "NOT_AVAILABLE");
  assert.equal(series.observations.length, 0);
});

test("status HTTP dipetakan ke kode error dengan detail FastAPI", async () => {
  const { repo } = fakeFetch(() => json({ detail: "Transisi OPEN → VERIFIED tidak diizinkan." }, 409));
  await assert.rejects(repo.updateTask("task-1", { status: "VERIFIED" }, { actor }), (error: unknown) => error instanceof RepositoryError && error.code === "ILLEGAL_TRANSITION" && error.message.includes("OPEN"));
  const { repo: notFound } = fakeFetch(() => json({ detail: "Not found" }, 404));
  await rejectsWith(notFound.getTask("x"), "NOT_FOUND");
  const { repo: server } = fakeFetch(() => json({}, 500));
  await rejectsWith(server.listStations(), "HTTP");
});

test("mutasi memvalidasi input sebelum dikirim dan menyertakan aktor", async () => {
  const { repo, calls } = fakeFetch(() => json({}, 500));
  await rejectsWith(repo.createTask({ mode: "HISTORICAL_REPLAY", title: "x", priority: "HIGH", assessment_id: null, hotspot_id: null, area_id: null, assignee_id: null, note: null }, { actor }), "VALIDATION");
  assert.equal(calls.length, 0, "input invalid tidak dikirim");
  await rejectsWith(repo.updateTask("task-1", { status: "ASSIGNED", assignee_id: "u-field-1" }, { actor }), "HTTP");
  assert.equal(calls[0]?.init.method, "PATCH");
  assert.equal((calls[0]?.init.headers as Record<string, string>)["X-Actor-Id"], "u-coord-1");
});

test("jaringan gagal → NETWORK, dibatalkan → ABORTED", async () => {
  const { repo } = fakeFetch(() => { throw new TypeError("fetch failed"); });
  await rejectsWith(repo.listStations(), "NETWORK");
  const controller = new AbortController();
  controller.abort();
  const { repo: aborted } = fakeFetch(() => { throw new DOMException("aborted", "AbortError"); });
  await rejectsWith(aborted.listStations({ signal: controller.signal }), "ABORTED");
});

test("health memanggil /health pada origin API", async () => {
  const { repo, calls } = fakeFetch(() => json({ status: "ok" }));
  assert.deepEqual(await repo.health(), { status: "ok", detail: "ok" });
  assert.equal(calls[0]?.url.toString(), "http://api.test/health");
});
