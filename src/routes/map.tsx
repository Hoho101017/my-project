import { createFileRoute } from "@tanstack/react-router";
import { MapWidget } from "@/components/MapWidget";
import { GearPanel } from "@/components/GearPanel";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { ClimateCard } from "@/components/ClimateCard";
import { Search, Menu } from "lucide-react";
import { useState } from "react";

type MapSearch = { destination?: string };

export const Route = createFileRoute("/map")({
  component: MapPage,
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    destination: typeof search.destination === "string" ? search.destination : undefined,
  }),
});

/**
 * Map page — when navigating into Map, the search bar expands to ~887×95
 * (9.34:1 ratio) and the map enlarges to ~890×584 (1.52:1 ratio).
 * Sidebar + the rest stay unchanged.
 */
function MapPage() {
  const { destination: initialDest } = Route.useSearch();
  const [destination, setDestination] = useState(initialDest ?? "");

  // Take left + center columns combined for map.
  const W_MAP_COL = 590;       // left + center merged (2× 290 + gap)
  const W_RIGHT = 268;
  const GAP = 10;
  const GAP_Y = 8;
  const H_SEARCH = 50;         // ~887×95 ratio scaled to 590w
  const H_GEAR = 460;
  const H_MAP = H_GEAR - H_SEARCH - GAP_Y; // lock map baseline to gear baseline
  const H_BOTTOM = 120;

  return (
    <div className="flex h-full w-full items-start justify-center pt-[2px]">
      <div className="flex items-stretch" style={{ width: W_MAP_COL + W_RIGHT + GAP, gap: GAP }}>
        {/* Map column */}
        <div className="flex flex-col" style={{ width: W_MAP_COL, gap: GAP_Y }}>
          <div className="flex items-center gap-2 rounded-full bg-[var(--panel)] px-4 shadow-sm ring-1 ring-black/5" style={{ height: H_SEARCH }}>
            <Menu className="h-5 w-5 text-foreground/70" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter Destination"
              className="flex-1 bg-transparent outline-none placeholder:text-foreground/60 text-base"
            />
            <Search className="h-5 w-5 text-foreground/70" />
          </div>
          <div className="relative overflow-hidden rounded-[24px]" style={{ height: H_MAP }}>
            <MapWidget className="h-full w-full" clickable={false} fullscreen />
            {destination && (
              <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-xl bg-black/65 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
                Routing to: {destination}
              </div>
            )}
          </div>
          {/* Bottom row of left+center columns */}
          <div className="grid grid-cols-2 gap-2" style={{ height: H_BOTTOM }}>
            <ClimateCard />
            <BrightnessCard />
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col" style={{ width: W_RIGHT, gap: GAP_Y }}>
          <div style={{ height: H_GEAR }}><GearPanel /></div>
          <div style={{ height: H_BOTTOM }}><StatusCard /></div>
        </div>
      </div>
    </div>
  );
}
