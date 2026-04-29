import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const FALLBACK: [number, number] = [1.5533, 110.3592];

function buildEmbedUrl(lat: number, lon: number, fullscreen: boolean) {
  const lonDelta = fullscreen ? 0.03 : 0.014;
  const latDelta = fullscreen ? 0.02 : 0.011;
  const bbox = [lon - lonDelta, lat - latDelta, lon + lonDelta, lat + latDelta]
    .map((v) => v.toFixed(6))
    .join(",");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(6)}%2C${lon.toFixed(6)}`;
}

export function MapWidget({ className = "", clickable = true, fullscreen = false }: { className?: string; clickable?: boolean; fullscreen?: boolean }) {
  const { t } = useTranslation();
  const [coords, setCoords] = useState<[number, number]>(FALLBACK);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords([pos.coords.latitude, pos.coords.longitude]),
      () => setCoords(FALLBACK),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    setLoaded(false);
  }, [coords, fullscreen]);

  const embedUrl = useMemo(() => buildEmbedUrl(coords[0], coords[1], fullscreen), [coords, fullscreen]);

  const inner = (
    <div className={`group relative h-full w-full overflow-hidden rounded-[28px] bg-[var(--panel-soft)] shadow-sm ring-1 ring-black/5 ${className}`}>
      {!loaded && <div className="absolute inset-0 bg-[var(--panel-soft)]" />}
      <iframe
        title={t("map.navigation")}
        src={embedUrl}
        loading="lazy"
        className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-[10%]">
        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-sky-500 shadow-lg shadow-sky-500/30 ring-4 ring-white/80">
          <div className="h-[10px] w-[10px] rounded-full bg-white" />
        </div>
      </div>
      {!fullscreen && (
        <div className="pointer-events-none absolute inset-x-[12px] top-[12px] z-[4] flex items-center justify-between">
          <div className="rounded-full bg-[var(--panel)]/94 px-[12px] py-[5px] text-[11px] font-semibold shadow-sm backdrop-blur">{t("map.navigation")}</div>
          <div className="rounded-full bg-[var(--panel)]/94 px-[10px] py-[5px] text-[10px] font-semibold text-foreground/70 shadow-sm backdrop-blur opacity-90 transition group-hover:opacity-100">{t("map.tapToEnlarge")}</div>
        </div>
      )}
      {clickable && !fullscreen && <Link to="/map" className="absolute inset-0 z-[5] block" aria-label={t("map.openFullMap")} />}
    </div>
  );

  return inner;
}
