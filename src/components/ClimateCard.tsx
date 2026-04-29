import { useApp } from "@/lib/app-context";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ClimateCard() {
  const { t } = useTranslation();
  const { temp, setTemp, acOn, setAcOn } = useApp();

  const dec = () => setTemp(Math.max(18, +(temp - 0.5).toFixed(1)));
  const inc = () => setTemp(Math.min(30, +(temp + 0.5).toFixed(1)));

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[28px] bg-[var(--panel)] px-[10px] py-[10px] shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-[6px]">
        <button onClick={dec} className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[var(--panel-soft)] hover:bg-[var(--active)]" aria-label={t("climate.decrease")}>
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex h-[46px] min-w-[112px] items-center justify-center rounded-full bg-[var(--panel-soft)] px-4 font-bold tabular-nums text-lg">
          {temp.toFixed(1)}°C
        </div>
        <button onClick={inc} className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[var(--panel-soft)] hover:bg-[var(--active)]" aria-label={t("climate.increase")}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-[6px] px-[2px]">
        <SeatVent direction="down" />
        <SeatVent direction="middle" />
        <SeatVent direction="up" />
        <button
          onClick={() => setAcOn(!acOn)}
          className={`flex h-[40px] min-w-[72px] items-center justify-center rounded-full px-4 text-[13px] font-bold transition-all ${acOn ? "bg-[var(--brand)] text-white" : "bg-[var(--panel-soft)] text-foreground"}`}
        >
          {t("climate.ac")}
        </button>
      </div>
    </div>
  );
}

/**
 * Seat with directional airflow arrow + dot — matches reference SS.
 *  - down: arrow curls down toward feet
 *  - middle: arrow points horizontally to torso
 *  - up: arrow curls up toward face/head
 */
function SeatVent({ direction }: { direction: "down" | "middle" | "up" }) {
  const { t } = useTranslation();
  const labelKey = direction === "down" ? "climate.ventDown" : direction === "middle" ? "climate.ventMiddle" : "climate.ventUp";
  return (
    <button className="flex h-[40px] w-[44px] items-center justify-center" aria-label={t(labelKey)}>
      <svg width="34" height="32" viewBox="0 0 34 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Person/seat silhouette */}
        <circle cx="14" cy="6" r="2.5" fill="currentColor" stroke="none" />
        <path d="M9 14 C9 11 11 10 14 10 C17 10 19 11 19 14 L19 20" />
        <path d="M9 14 L9 22 L14 22" />
        <path d="M14 22 L19 22 L19 28" />
        {/* Airflow arrow with dot */}
        {direction === "down" && (
          <>
            <circle cx="26" cy="6" r="1.8" fill="currentColor" stroke="none" />
            <path d="M26 9 Q26 18 22 22 L20 22 M22 22 L22 19 M22 22 L25 22" />
          </>
        )}
        {direction === "middle" && (
          <>
            <circle cx="26" cy="10" r="1.8" fill="currentColor" stroke="none" />
            <path d="M26 13 Q26 19 22 21 L20 21 M22 21 L22 18 M22 21 L25 21" />
          </>
        )}
        {direction === "up" && (
          <>
            <circle cx="22" cy="22" r="1.8" fill="currentColor" stroke="none" />
            <path d="M22 19 Q22 10 26 7 L28 7 M26 7 L26 10 M26 7 L23 7" />
          </>
        )}
      </svg>
    </button>
  );
}

