import { createFileRoute } from "@tanstack/react-router";
import { GearPanel } from "@/components/GearPanel";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { MapWidget } from "@/components/MapWidget";
import { TrafficWidget } from "@/components/TrafficWidget";
import { useApp } from "@/lib/app-context";
import { Gauge, ParkingSquare, Car as CarIcon } from "lucide-react";
import { CockpitLayout } from "@/components/CockpitLayout";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/car")({ component: CarPage });

const MODES = [
  { v: "adaptive" as const, labelKey: "car.adaptiveCruise", icon: Gauge },
  { v: "parking"  as const, labelKey: "car.autoParking",     icon: ParkingSquare },
  { v: "lane"     as const, labelKey: "car.laneCentering",   icon: CarIcon },
];

/**
 * Car / Driving Modes page — Three buttons sized 147×280 (ratio 0.525:1)
 * and "Driving Modes" label 198×29.
 */
function CarPage() {
  const { drivingMode, setDrivingMode } = useApp();
  const { t } = useTranslation();

  return (
    <CockpitLayout
      leftTop={<TrafficWidget className="h-full w-full" />}
      leftBottom={
        <div className="flex h-full flex-col rounded-[24px] bg-[var(--panel)] px-2 py-1.5 shadow-sm ring-1 ring-black/5">
          <div className="mx-auto text-[11px] font-bold leading-none">{t("car.drivingModes")}</div>
          <div className="grid flex-1 grid-cols-3 gap-1.5 pt-1">
            {MODES.map(({ v, labelKey, icon: Icon }) => {
              const active = drivingMode === v;
              return (
                <button
                  key={v}
                  onClick={() => setDrivingMode(v)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-[14px] border px-1 py-1 transition-all ${
                    active ? "border-green-400 bg-green-200/70" : "border-border bg-[var(--panel-soft)] hover:bg-[var(--active)]/50"
                  }`}
                >
                  <Icon className={`h-7 w-7 ${active ? "text-green-700" : ""}`} strokeWidth={1.8} />
                  <span className={`text-center text-[10px] font-bold leading-[1.1] ${active ? "text-green-800" : ""}`}>{t(labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      }
      centerTop={<MapWidget className="h-full w-full" />}
      centerBottom={<BrightnessCard />}
      rightTop={<GearPanel />}
      rightBottom={<StatusCard />}
    />
  );
}
