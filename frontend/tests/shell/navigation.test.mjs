import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const baseURL = process.env.SHELL_BASE_URL ?? "http://127.0.0.1:3000";

test("shell: routing, mode lintas halaman, sidebar, drawer, dan responsivitas", { timeout: 90_000 }, async (t) => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}),
  });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(baseURL);
  await page.waitForURL("**/dashboard");
  assert.equal(await page.locator("html").getAttribute("lang"), "id");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, "Tidak boleh ada overflow horizontal pada 1440px");
  await page.getByRole("button", { name: "Pemantauan terkini", exact: true }).click();
  await page.getByRole("button", { name: "Pemantauan terkini", exact: true }).getAttribute("aria-pressed").then((value) => assert.equal(value, "true"));
  await page.locator("main").getByText("Data muka air terkini tidak tersedia", { exact: true }).waitFor();

  const modules = [
    ["Muka air tanah", "/groundwater", "Groundwater Intelligence"],
    ["Hotspot satelit", "/hotspots", "Satellite Fire Detection"],
    ["Prioritas pemeriksaan", "/priorities", "Prevention Decision Engine"],
    ["Tugas & verifikasi", "/tasks", "Field Action & Verification"],
    ["Eksperimen ML", "/experiments/ml", "Groundwater ML Forecasting"],
    ["Dashboard", "/dashboard", "Ruang kerja pemantauan"],
  ];
  for (const [label, path, title] of modules) {
    await page.locator("aside").getByRole("link", { name: label, exact: true }).click();
    await page.waitForURL(`${baseURL}${path}`);
    await page.getByRole("heading", { name: title, exact: true, level: 1 }).waitFor();
    assert.equal(await page.locator("aside").getByRole("link", { name: label, exact: true }).getAttribute("aria-current"), "page");
    assert.equal(await page.getByRole("button", { name: "Pemantauan terkini", exact: true }).getAttribute("aria-pressed"), "true");
  }

  await page.getByRole("button", { name: "Ciutkan sidebar" }).click();
  await page.getByRole("button", { name: "Perluas sidebar" }).waitFor();
  await page.locator("aside").getByRole("link", { name: "Muka air tanah", exact: true }).click();
  await page.waitForURL("**/groundwater");
  await page.getByRole("button", { name: "Perluas sidebar" }).click();
  await page.getByRole("button", { name: "Putar historis", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Putar historis", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator("main").getByText("Data muka air terkini tidak tersedia", { exact: true }).count(), 0);

  for (const width of [768, 375]) {
    await page.setViewportSize({ width, height: 900 });
    const trigger = page.getByRole("button", { name: "Buka navigasi" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Navigasi GambutOps" });
    await dialog.waitFor();
    await page.keyboard.press("Tab");
    assert.equal(await dialog.evaluate((element) => element.contains(document.activeElement)), true);
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
    await trigger.click();
    await page.getByRole("dialog").getByRole("link", { name: "Hotspot satelit", exact: true }).click();
    await page.waitForURL("**/hotspots");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert.equal(overflow, false, `Tidak boleh ada overflow horizontal pada ${width}px`);
  }

  await page.goto(`${baseURL}/alamat-tidak-ada`);
  await page.getByRole("heading", { name: "Halaman tidak ditemukan" }).waitFor();
  await page.getByRole("link", { name: "Kembali ke dashboard" }).click();
  await page.waitForURL("**/dashboard");
  assert.deepEqual(pageErrors, [], "Tidak boleh ada exception browser");
});
