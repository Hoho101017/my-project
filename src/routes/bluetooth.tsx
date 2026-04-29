import { createFileRoute } from "@tanstack/react-router";
import { GearPanel } from "@/components/GearPanel";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { MapWidget } from "@/components/MapWidget";
import { MediaCard } from "@/components/MediaCard";
import { useApp } from "@/lib/app-context";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Smartphone, Headphones } from "lucide-react";
import { CockpitLayout } from "@/components/CockpitLayout";
import { ClimateCard } from "@/components/ClimateCard";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/bluetooth")({ component: BluetoothPage });

const AVAILABLE = [
  { name: "POCOX3", icon: Smartphone },
  { name: "Zen's iPhone", icon: Smartphone },
  { name: "CXT-01", icon: Headphones },
  { name: "MX-SK18", icon: Headphones },
];

function BluetoothPage() {
  const { t } = useTranslation();
  const { bluetoothOn, setBluetoothOn, pairedDevice, setPairedDevice, musicExpanded, setMusicExpanded } = useApp();
  const toggleMusic = () => setMusicExpanded(!musicExpanded);
  const pairUrl = typeof window !== "undefined" ? `${window.location.origin}/pair` : "/pair";

  return (
    <CockpitLayout
      leftTop={musicExpanded ? (
        <MediaCard expanded onToggleExpand={toggleMusic} />
      ) : (
        <div className="flex h-full flex-col gap-[8px] rounded-[28px] bg-[var(--panel)] px-[12px] py-[12px] shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold">{t("bluetooth.title")}</span>
            <button
              onClick={() => setBluetoothOn(!bluetoothOn)}
              className={`relative h-[24px] w-[42px] rounded-full transition-colors ${bluetoothOn ? "bg-[var(--brand)]" : "bg-foreground/20"}`}
            >
              <span className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-background shadow transition-all ${bluetoothOn ? "left-[20px]" : "left-[2px]"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] leading-none">
            <span className="text-foreground/70">{t("bluetooth.deviceName")}</span>
            <span className="font-semibold">HKI</span>
          </div>
          <div className="rounded-[16px] bg-[var(--panel-soft)] px-[10px] py-[9px]">
            <div className="mb-[6px] text-[11px] font-semibold">{t("bluetooth.pairedDevice")}</div>
            {pairedDevice ? (
              <div className="rounded-[12px] bg-[var(--panel)] px-[10px] py-[8px] text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{pairedDevice}</span></div>
                  <button onClick={() => setPairedDevice(null)} className="text-[10px] text-foreground/60 hover:underline">{t("bluetooth.unpair")}</button>
                </div>
              </div>
            ) : (
              <div className="space-y-[8px]">
                <div className="text-xs text-foreground/60">{t("bluetooth.unpairedShort")}</div>
                <div className="flex items-center justify-center rounded-[14px] bg-background p-[8px]">
                  <QRCodeDisplay value={pairUrl} size={96} />
                </div>
              </div>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-auto rounded-[16px] bg-[var(--panel-soft)] px-[10px] py-[9px]">
            <div className="mb-[6px] text-[11px] font-semibold">{t("bluetooth.availableDevices")}</div>
            <ul className="flex flex-col gap-[6px]">
              {AVAILABLE.filter((d) => d.name !== pairedDevice).map(({ name, icon: I }) => (
                <li key={name}>
                  <button
                    disabled={!bluetoothOn}
                    onClick={() => setPairedDevice(name)}
                    className="flex w-full items-center gap-1.5 rounded-[12px] bg-[var(--panel)] px-[10px] py-[8px] text-left text-xs hover:bg-[var(--active)] disabled:opacity-40"
                  >
                    <I className="h-3.5 w-3.5" /> {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      leftTopLarge={musicExpanded}
      centerTop={<MapWidget className="h-full w-full" />}
      rightTop={<GearPanel />}
      centerBottom={<BrightnessCard />}
      rightBottom={<StatusCard />}
      leftMiddle={musicExpanded ? undefined : <MediaCard onToggleExpand={toggleMusic} />}
      leftBottom={<ClimateCard />}
    />
  );
}
