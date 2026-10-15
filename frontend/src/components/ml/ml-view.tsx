"use client";

import { useState, type FormEvent } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { useMlMetrics } from "@/components/providers/data-hooks";
import { useMonitoring } from "@/components/providers/monitoring-context";
import { useRepositoryQuery } from "@/components/providers/use-repository-query";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/async-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { errorMessage } from "@/lib/api/errors";
import { addDays } from "@/lib/domain/dates";
import { formatDate, formatDateRange, formatDateTime, formatDecimal, formatMeters, formatShortDate } from "@/lib/format";
import type { MlExperiment, MlForecastInput } from "@/types";

const fieldClass = "min-h-11 w-full rounded-md border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Forecast({ experiment }: { experiment: MlExperiment }) {
  const firstDate = experiment.predictions[0]?.date ?? experiment.test_period.from;
  const [date, setDate] = useState(addDays(firstDate, -1));
  const [request, setRequest] = useState<MlForecastInput | null>(null);
  const result = useRepositoryQuery(request ? ["ml-forecast", experiment.model_version, request] : null,
    (repo, signal) => repo.forecastGroundwater(request!, { signal }));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = { station_id: experiment.station_id, date };
    if (request?.date === date) result.refetch();
    else setRequest(next);
  }

  return (
    <Card>
      <CardHeader><CardTitle>Coba prediksi historis +1 hari</CardTitle><p className="text-sm leading-6 text-muted-foreground">Pilih tanggal input terakhir. Server memerlukan tujuh hari pengukuran valid berurutan sampai tanggal itu. Hasil hanya untuk eksperimen historis.</p></CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={submit} className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
          <label className="w-full space-y-2 text-sm sm:max-w-xs"><span>Tanggal input terakhir</span><input className={fieldClass} type="date" required value={date} onChange={(event) => { setDate(event.target.value); setRequest(null); }} /></label>
          <Button type="submit" disabled={result.status === "loading"}>{result.status === "loading" ? "Menghitung…" : "Jalankan prediksi"}</Button>
        </form>
        <div aria-live="polite" className="space-y-3">
          {result.status === "loading" && <p role="status" className="text-sm">Memuat prediksi historis…</p>}
          {result.status === "error" && <ErrorState description={errorMessage(result.error)} onRetry={result.refetch} />}
          {result.data?.status === "REJECTED" && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Prediksi belum dapat dibuat: {result.data.reason}</p>}
          {result.data?.status === "OK" && <div className="space-y-2 rounded-lg border p-4 text-sm leading-6">
            <p className="font-semibold">Prediksi untuk {formatDate(result.data.forecast_date)}</p>
            <p>Model: <strong>{formatMeters(result.data.predicted_gwt_m, 3)}</strong> · Baseline: <strong>{formatMeters(result.data.baseline_gwt_m, 3)}</strong></p>
            <p className="break-words text-xs text-muted-foreground">Input {formatDate(result.data.input_date)} · Versi {result.data.model_version} · {result.data.release_gate}</p>
            <p>Hasil eksperimen historis; tidak menggambarkan kondisi terkini dan tidak digunakan untuk keputusan operasional.</p>
          </div>}
        </div>
      </CardContent>
    </Card>
  );
}

function Experiment({ experiment }: { experiment: MlExperiment }) {
  const lines = [
    { key: "actual_m", label: "Terukur", color: "var(--color-primary)" },
    { key: "predicted_m", label: "Prediksi model", color: "var(--color-teal)" },
    { key: "baseline_m", label: "Baseline", color: "var(--color-muted-foreground)", dash: "5 4" },
  ];
  return <div className="space-y-5">
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2"><CardTitle>Evaluasi {experiment.station_code}</CardTitle><Badge variant="warning">{experiment.release_gate === "EXPERIMENT_ONLY" ? "Eksperimen saja" : "Layak untuk prediksi historis"}</Badge>{experiment.is_simulation && <Badge variant="warning">SIMULASI</Badge>}</div>
        <p className="text-sm leading-6 text-muted-foreground">{experiment.beats_baseline ? "Model mengalahkan baseline pada evaluasi ini." : "Model belum mengalahkan baseline. Hasil tidak digunakan oleh mesin prioritas."} Baseline menganggap nilai besok sama dengan nilai hari ini.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="mb-3 text-left text-xs text-muted-foreground">Galat dalam sentimeter; makin kecil makin baik. Model dan baseline diuji pada tanggal yang sama.</caption><thead><tr className="border-b"><th scope="col" className="py-3 pr-4">Metode</th><th scope="col" className="px-2">MAE (cm)</th><th scope="col" className="px-2">RMSE (cm)</th></tr></thead><tbody>{[{ label: "Random Forest", metrics: experiment.model_metrics }, { label: "Baseline", metrics: experiment.baseline_metrics }].map(({ label, metrics: values }) =>
          <tr key={label} className="border-b"><th scope="row" className="py-3 pr-4 font-medium">{label}</th><td className="px-2 tabular-nums">{formatDecimal(values.mae_cm, 3)}</td><td className="px-2 tabular-nums">{formatDecimal(values.rmse_cm, 3)}</td></tr>
        )}</tbody></table></div>
        <p className="text-xs leading-5 text-muted-foreground">MAE adalah rata-rata besar kesalahan. RMSE memberi bobot lebih besar pada kesalahan besar.</p>
        <dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Periode pelatihan</dt><dd>{formatDateRange(experiment.training_period.from, experiment.training_period.to)}</dd></div><div><dt className="text-muted-foreground">Periode uji · {experiment.test_size} sampel</dt><dd>{formatDateRange(experiment.test_period.from, experiment.test_period.to)}</dd></div><div className="min-w-0"><dt className="text-muted-foreground">Versi model</dt><dd className="break-words">{experiment.model_version}</dd></div><div><dt className="text-muted-foreground">Dilatih pada</dt><dd>{formatDateTime(experiment.trained_at)}</dd></div></dl>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>Terukur dan prediksi pada data uji</CardTitle><p className="text-sm text-muted-foreground">Muka air tanah dalam meter. Nilai negatif berada di bawah permukaan tanah.</p></CardHeader>
      <CardContent className="space-y-4">
        {experiment.predictions.length ? <figure aria-label={`Grafik evaluasi ${experiment.station_code}`}>
          <div className="h-[300px] w-full"><LineChart responsive style={{ width: "100%", height: "100%" }} data={experiment.predictions} margin={{ top: 12, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="date" tickFormatter={formatShortDate} minTickGap={35} tick={{ fontSize: 11 }} />
            <YAxis width={58} domain={["auto", "auto"]} tickFormatter={(value: number) => formatDecimal(value)} tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={(value) => formatDate(String(value))} formatter={(value) => typeof value === "number" ? formatMeters(value, 3) : "Tidak tersedia"} />
            {lines.map((line) => <Line key={line.key} dataKey={line.key} name={line.label} stroke={line.color} strokeDasharray={line.dash} dot={false} connectNulls={false} isAnimationActive={false} />)}
          </LineChart></div>
          <figcaption className="flex flex-wrap gap-4 text-xs">{lines.map((line) => <span key={line.key} className="flex items-center gap-2"><span aria-hidden="true" className="w-5 border-t-2" style={{ borderColor: line.color, borderStyle: line.dash ? "dashed" : "solid" }} />{line.label}</span>)}</figcaption>
        </figure> : <EmptyState title="Titik evaluasi belum tersedia" description="Metrik tersedia, tetapi API belum menyertakan titik grafik." />}
        <details className="rounded-lg border p-3 text-sm"><summary className="cursor-pointer font-medium">Lihat nilai evaluasi dalam tabel</summary><div className="mt-3 max-h-80 overflow-auto"><table className="w-full text-left text-xs"><thead><tr><th scope="col" className="p-2">Tanggal</th>{lines.map((line) => <th key={line.key} scope="col" className="p-2">{line.label} (m)</th>)}</tr></thead><tbody>{experiment.predictions.map((point) => <tr key={point.date} className="border-t"><th scope="row" className="p-2 font-normal">{formatDate(point.date)}</th>{lines.map((line) => { const value = point[line.key as "actual_m" | "predicted_m" | "baseline_m"]; return <td key={line.key} className="p-2 tabular-nums">{value === null ? "Tidak tersedia" : formatDecimal(value, 3)}</td>; })}</tr>)}</tbody></table></div></details>
      </CardContent>
    </Card>
    <Forecast key={experiment.model_version} experiment={experiment} />
    <Card><CardHeader><CardTitle>Metode dan batasan</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6"><p>Target: muka air tanah satu hari setelah input terakhir. Pembagian data mengikuti waktu: 70% pelatihan, 15% validasi, 15% pengujian. Hari yang hilang tidak diinterpolasi.</p><ul className="list-disc space-y-2 pl-5">{experiment.limitations.map((limitation, index) => <li key={index}>{limitation}</li>)}</ul><details><summary className="cursor-pointer font-medium">Fitur model</summary><ul className="mt-2 list-disc break-words pl-5">{experiment.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></details></CardContent></Card>
  </div>;
}

export function MlView() {
  const metrics = useMlMetrics();
  const { mode } = useMonitoring();
  const [stationId, setStationId] = useState("");
  const experiments = metrics.data?.status === "AVAILABLE" ? metrics.data.experiments : [];
  const experiment = experiments.find((item) => item.station_id === stationId) ?? experiments[0];

  return <div className="space-y-6">
    <header className="space-y-3"><p className="text-[10px] font-semibold tracking-[0.16em] text-teal">EKSPERIMEN · PREDIKSI</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Uji prediksi muka air tanah</h1><p className="max-w-3xl text-sm leading-6 text-muted-foreground">Bandingkan perkiraan satu hari ke depan dengan pengukuran dan baseline sederhana. Hasil berasal dari eksperimen historis 2018–2019, bukan kondisi saat ini.</p></header>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{mode === "CURRENT_MONITORING" && "Anda sedang dalam mode terkini. "}Halaman ini selalu menampilkan eksperimen historis. Filter wilayah dan periode pemantauan tidak mengubah periode uji model. Hasil tidak digunakan untuk keputusan operasional.</div>
    {metrics.status === "loading" && <LoadingState label="Memuat hasil eksperimen…" />}
    {metrics.status === "error" && <ErrorState description={errorMessage(metrics.error)} onRetry={metrics.refetch} />}
    {metrics.status === "success" && !experiment && <EmptyState title="Hasil eksperimen belum tersedia" description={metrics.data?.status === "NOT_AVAILABLE" ? metrics.data.reason : "Belum ada model yang tersedia dari server."} action={<Button variant="outline" onClick={metrics.refetch}>Periksa lagi</Button>} />}
    {experiment && <><label className="block max-w-sm space-y-2 text-sm"><span className="font-medium">Stasiun eksperimen</span><select className={fieldClass} value={experiment.station_id} onChange={(event) => setStationId(event.target.value)}>{experiments.map((item) => <option key={item.station_id} value={item.station_id}>{item.station_code}</option>)}</select></label><Experiment key={`${experiment.station_id}:${experiment.model_version}`} experiment={experiment} /></>}
  </div>;
}
