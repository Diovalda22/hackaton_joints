"use client";

import { useCallback } from "react";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import { useMonitoring } from "@/components/providers/monitoring-context";
import { AREAS, findArea } from "@/lib/domain/areas";
import { bboxPolygon, unionBbox } from "@/lib/maps/map-config";
import type { Bbox } from "@/types";
import { BaseMap } from "./base-map";

const SOURCE_ID = "wilayah-pemantauan";
const ALL_AREAS_BBOX = unionBbox(AREAS.map((area) => area.bbox)) as Bbox;

function areaCollection(selectedId: string | null) {
  return {
    type: "FeatureCollection" as const,
    features: AREAS.map((area) => ({
      type: "Feature" as const,
      properties: { id: area.id, selected: selectedId === area.id },
      geometry: { type: "Polygon" as const, coordinates: bboxPolygon(area.bbox) },
    })),
  };
}

/** Peta kotak wilayah pemantauan; mengikuti filter wilayah global. */
export function AreaOverviewMap({ className }: { className?: string }) {
  const { filter } = useMonitoring();
  const selected = findArea(filter.area_id);

  const addAreas = useCallback((map: MapLibreMap) => {
    if (map.getSource(SOURCE_ID)) return;
    map.addSource(SOURCE_ID, { type: "geojson", data: areaCollection(null) });
    map.addLayer({ id: `${SOURCE_ID}-isi`, type: "fill", source: SOURCE_ID, paint: { "fill-color": "#227b54", "fill-opacity": ["case", ["get", "selected"], 0.22, 0.1] } });
    map.addLayer({ id: `${SOURCE_ID}-garis`, type: "line", source: SOURCE_ID, paint: { "line-color": "#18543b", "line-width": ["case", ["get", "selected"], 2.5, 1.5], "line-dasharray": [2, 1.5] } });
  }, []);

  const highlight = useCallback((map: MapLibreMap) => {
    addAreas(map);
    map.getSource<GeoJSONSource>(SOURCE_ID)?.setData(areaCollection(filter.area_id));
  }, [addAreas, filter.area_id]);

  return (
    <BaseMap
      label={selected ? `Peta wilayah pemantauan ${selected.label}` : "Peta wilayah pemantauan"}
      bounds={selected?.bbox ?? ALL_AREAS_BBOX}
      onStyleReady={highlight}
      className={className}
    />
  );
}
