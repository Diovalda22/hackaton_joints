import { LayoutDashboard, Waves, Satellite, ListOrdered, ClipboardCheck, FlaskConical, type LucideIcon } from "lucide-react";

export interface NavigationItem {
  href: string;
  label: string;
  title: string;
  eyebrow: string;
  phase: string;
  icon: LucideIcon;
  description: string;
  capabilities: readonly string[];
}

export const navigation: readonly NavigationItem[] = [
  {
    href: "/dashboard", label: "Dashboard", title: "Ruang kerja pemantauan",
    eyebrow: "GAMBUTOPS / IKHTISAR", phase: "F1.1", icon: LayoutDashboard,
    description: "Satu ruang kerja untuk memahami kondisi gambut, meninjau indikasi, dan mengoordinasikan tindak lanjut.",
    capabilities: ["Ringkasan pemantauan sesuai mode, area, dan periode", "Peta ringkasan dan prioritas pemeriksaan", "Aktivitas terbaru beserta sumber dan waktu pengamatan"],
  },
  {
    href: "/groundwater", label: "Muka air tanah", title: "Groundwater Intelligence",
    eyebrow: "PREVENT / MUKA AIR TANAH", phase: "F1.2", icon: Waves,
    description: "Telusuri pengamatan historis dan kelengkapan data muka air tanah untuk mendukung pemeriksaan tata air.",
    capabilities: ["Pemilihan stasiun BRG6, BRG3, dan stasiun lainnya", "Grafik GWT dalam meter, filter tanggal, dan statistik", "Gap data tetap terlihat; nilai hilang tidak diubah menjadi nol"],
  },
  {
    href: "/hotspots", label: "Hotspot satelit", title: "Satellite Fire Detection",
    eyebrow: "DETECT / ANOMALI PANAS", phase: "F1.3", icon: Satellite,
    description: "Tinjau anomali panas satelit dengan konteks lokasi, waktu, sensor, dan status verifikasinya.",
    capabilities: ["Peta MapLibre interaktif dengan titik DEMO", "Daftar hotspot terhubung dengan pemilihan pada peta", "Filter tanggal, sensor, area, serta detail confidence dan FRP"],
  },
  {
    href: "/priorities", label: "Prioritas pemeriksaan", title: "Prevention Decision Engine",
    eyebrow: "PREVENT / PRIORITAS", phase: "F1.4", icon: ListOrdered,
    description: "Pahami alasan setiap prioritas pemeriksaan melalui input, sumber, dan versi aturan yang dapat ditelusuri.",
    capabilities: ["Assessment deterministik dengan alasan dan rekomendasi", "Input hilang dan batas waktu as_of ditampilkan", "Pembuatan tugas pemeriksaan dari assessment"],
  },
  {
    href: "/tasks", label: "Tugas & verifikasi", title: "Field Action & Verification",
    eyebrow: "ACT / TINDAK LANJUT", phase: "F1.5", icon: ClipboardCheck,
    description: "Koordinasikan tugas pemeriksaan dan tinjau laporan lapangan simulasi melalui alur status yang tercatat.",
    capabilities: ["Tampilan koordinator dan petugas dengan filter tugas", "Form tugas dan laporan berlabel SIMULASI", "Validasi transisi, riwayat aktor, dan persistensi setelah reload"],
  },
  {
    href: "/experiments/ml", label: "Eksperimen ML", title: "Groundwater ML Forecasting",
    eyebrow: "EKSPERIMEN / PREDIKSI GWT", phase: "F1.6", icon: FlaskConical,
    description: "Ruang eksperimen prediksi muka air tanah satu hari ke depan, dengan baseline dan batasan yang transparan.",
    capabilities: ["Tujuan eksperimen GWT +1 hari dan baseline persistence", "Area evaluasi dan grafik setelah hasil eksperimen tersedia", "Empty state ketika model belum dilatih; tidak ada metrik rekaan"],
  },
];

export function findNavigationItem(pathname: string) {
  return navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
