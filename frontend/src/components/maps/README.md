# Map components

- `base-map.tsx` — MapLibre wrapper: lazy-loads `maplibre-gl`, Indonesian control labels, two-finger/Ctrl gestures so the page still scrolls, rotation disabled. Has a **Layar penuh** toggle that covers the whole viewport on desktop and mobile (CSS overlay, plus the Fullscreen API when the browser supports it — iPhone falls back to the overlay); Esc or the button exits, page scroll is locked and one-finger panning is enabled while fullscreen. Touch devices get 40px zoom buttons. Falls back to a plain background when the basemap style fails (data layers still render) and to a message with retry when WebGL is unavailable. Add sources/layers in `onStyleReady`; it is re-run after a style swap and whenever the callback changes, so keep it idempotent.
- `area-overview-map.tsx` / `area-overview-section.tsx` — DEMO area boxes that follow the global area filter (shown on `/hotspots` until F1.3).

Basemap: OpenFreeMap Positron (no key). Override with `NEXT_PUBLIC_MAP_STYLE_URL`. Stations have no source coordinates, so no station pins are drawn.
