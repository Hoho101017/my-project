import { useApp } from "@/lib/app-context";
import { useState } from "react";

const GEARS = ["P", "R", "N", "D"] as const;

/**
 * Gear panel — based on 428×724 reference.
 * Sub-areas: icon row 388×91 (4.27:1), PRND list 143×414, speed 261×171.
 */
export function GearPanel() {
  const { gear, setGear } = useApp();
  const [activeControl, setActiveControl] = useState<"low" | "high" | "car">("car");
  const [doorOpen, setDoorOpen] = useState(false);
  const idx = GEARS.indexOf(gear);
  const prev = () => idx > 0 && setGear(GEARS[idx - 1]);
  const next = () => idx < GEARS.length - 1 && setGear(GEARS[idx + 1]);
  const reversing = gear === "R";

  return (
    <div
      className={[
        "flex h-full w-full flex-col rounded-[24px] px-[10px] py-[10px]",
        reversing
          ? "bg-transparent shadow-none ring-0 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          : "bg-[var(--panel)] shadow-sm ring-1 ring-black/5",
      ].join(" ")}
    >
      {/* Top icon row (low / high beam / car) — 4.27:1 ratio */}
      <div
        className={[
          "flex shrink-0 items-center justify-around rounded-full px-[6px]",
          reversing ? "bg-transparent" : "bg-[var(--panel-soft)]",
        ].join(" ")}
        style={{ height: 38 }}
      >
        {[
          { key: "low" as const, icon: <svg width="32" height="18" viewBox="0 0 32 18" fill="none"><path d="M2 3 L13 3 A6 6 0 0 1 13 15 L2 15 Z" stroke="currentColor" strokeWidth="1.5"/><path d="M17 5 L23 4 M17 9 L25 9 M17 13 L23 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, label: "Low beam" },
          { key: "high" as const, icon: <svg width="32" height="18" viewBox="0 0 32 18" fill="none"><path d="M2 3 L13 3 A6 6 0 0 1 13 15 L2 15 Z" stroke="currentColor" strokeWidth="1.5"/><path d="M17 4 L25 4 M17 9 L27 9 M17 14 L25 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, label: "High beam" },
          { key: "car" as const, icon: (
            <svg width="30" height="18" viewBox="0 0 30 18" fill="none">
              <path d="M3 12 L5 6 L15 5 L22 8 L25 9 L25 12 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="9" cy="13" r="1.6" fill="currentColor"/>
              <circle cx="20" cy="13" r="1.6" fill="currentColor"/>
              {doorOpen && <path d="M14 5 L14 -1" stroke="#ef4444" strokeWidth="1.8" />}
            </svg>
          ), label: "Doors" },
        ].map(({ key, icon, label }) => {
          const active = activeControl === key;
          const isDoorWarn = key === "car" && doorOpen;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveControl(key);
                if (key === "car") setDoorOpen((d) => !d);
              }}
              className={`flex h-[28px] flex-1 items-center justify-center rounded-full transition mx-[2px] ${
                isDoorWarn ? "bg-red-500 text-white" : active ? "bg-[var(--active)]" : "hover:bg-[var(--active)]/60"
              }`}
              aria-label={label}
              title={key === "car" ? (doorOpen ? "Door open — click to close" : "Doors closed — click to simulate open") : label}
            >
              {icon}
            </button>
          );
        })}
      </div>

      {/* Current gear with arrows */}
      <div className="mt-[8px] flex shrink-0 items-center justify-between px-[2px]">
        <button onClick={prev} disabled={idx === 0} aria-label="Previous gear" className="disabled:opacity-30">
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <path d="M2 13 L14 4 L14 9 L42 9 L42 17 L14 17 L14 22 Z" fill={idx === 0 ? "#d1d5db" : "#22c55e"}/>
          </svg>
        </button>
        <span className="min-w-[24px] text-center font-extrabold leading-none text-6xl">{gear}</span>
        <button onClick={next} disabled={idx === GEARS.length - 1} aria-label="Next gear" className="disabled:opacity-30">
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <path d="M42 13 L30 4 L30 9 L2 9 L2 17 L30 17 L30 22 Z" fill={idx === GEARS.length - 1 ? "#d1d5db" : "#22c55e"}/>
          </svg>
        </button>
      </div>

      {/* PRND vertical list — 143:414 ratio inside */}
      <div className="mt-[6px] flex flex-1 flex-col items-center justify-center gap-[6px]">
        {GEARS.map((g) => {
          const active = g === gear;
          return (
            <button
              key={g}
              onClick={() => setGear(g)}
              className={`flex h-[36px] w-[36px] items-center justify-center rounded-full font-extrabold leading-none transition-all ${
                active
                  ? `bg-[var(--active)] ${reversing ? "text-white ring-2 ring-white/25" : "text-foreground ring-2 ring-foreground/15"} text-3xl`
                  : `${reversing ? "text-white/90" : "text-foreground/85"} hover:bg-[var(--active)]/50`
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Speed area — 261×171 (1.53:1). P=0, R=5 (slow reverse), N=current, D=70 */}
      <div className="shrink-0 pb-[2px] pt-[4px] text-center">
        <div className="font-extrabold leading-none text-8xl">
          {gear === "P" ? 0 : gear === "R" ? 5 : gear === "N" ? 0 : 70}
        </div>
        <div className={`mt-[3px] text-[12px] font-bold tracking-[0.18em] ${reversing ? "text-white/90" : "text-foreground/80"}`}>KM/H</div>
      </div>
    </div>
  );
}
