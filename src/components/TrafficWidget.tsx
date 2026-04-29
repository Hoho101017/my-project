import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

/**
 * Realistic-ish ADAS / front camera view.
 */
export function TrafficWidget({ className = "", clickable = true, fullscreen = false }: { className?: string; clickable?: boolean; fullscreen?: boolean }) {
  const { t } = useTranslation();
  const [tooClose, setTooClose] = useState(false);
  const { playBeep } = useApp();

  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const show = Math.random() < 0.4;
      setTooClose(show);
      if (show) playBeep("warn");
      const next = show ? 2200 : 3500 + Math.random() * 2500;
      setTimeout(tick, next);
    };
    const initial = setTimeout(tick, 2200);
    return () => { alive = false; clearTimeout(initial); };
  }, [playBeep]);


  const inner = (
    <div className={`group relative overflow-hidden rounded-[24px] shadow-sm ring-1 ring-black/5 ${className}`}>
      {/* SKY */}
      <div className="absolute inset-x-0 top-0 h-[40%]"
        style={{
          background: "linear-gradient(to bottom, #93c5fd 0%, #bfdbfe 60%, #e2e8f0 100%)",
        }}
      />
      {/* Distant skyline silhouettes */}
      <div className="absolute inset-x-0" style={{ top: "30%", height: "10%" }}>
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-full w-full opacity-50">
          <path d="M0 10 L5 6 L10 8 L14 4 L20 7 L26 3 L32 6 L40 5 L46 7 L54 4 L62 6 L70 5 L78 7 L86 4 L94 6 L100 5 L100 10 Z" fill="#475569"/>
        </svg>
      </div>

      {/* GROUND */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: "40%", background: "linear-gradient(to bottom, #475569 0%, #334155 30%, #1e293b 100%)" }} />

      {/* ROAD trapezoid */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: "40%" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)",
            clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
          }}
        />
        {/* Solid edge lines */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="40" y1="0" x2="0" y2="100" stroke="#fbbf24" strokeWidth="0.6" />
          <line x1="60" y1="0" x2="100" y2="100" stroke="#fbbf24" strokeWidth="0.6" />
        </svg>

        {/* Animated dashed center lane lines (left + right of ego lane) */}
        {[-1, 1].map((side) => (
          <div key={side} className="absolute inset-0 overflow-hidden">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute left-1/2 animate-lane-dash bg-white"
                style={{
                  top: 0,
                  width: "1.4%",
                  height: "5%",
                  transform: `translate(calc(-50% + ${side * 6}%), 0)`,
                  animationDelay: `${i * 0.23}s`,
                  borderRadius: 2,
                  opacity: 0.95,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Other cars */}
      <RoadCar topPct={48} side="left" delay="0s" color="#475569" scale={0.55} />
      <RoadCar topPct={52} side="right" delay="0.6s" color="#a3a3a3" scale={0.6} />
      <RoadCar topPct={62} side="left" delay="1.1s" color="#1e293b" scale={0.75} />
      <RoadCar topPct={70} side="center" delay="0.3s" color={tooClose ? "#dc2626" : "#0f172a"} scale={0.95} />

      {/* Ego car (purple) */}
      <div className="pointer-events-none absolute bottom-[3%] left-1/2 -translate-x-1/2 animate-car-bob">
        <svg width="86" height="58" viewBox="0 0 86 58">
          <defs>
            <linearGradient id="egoBody" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="100%" stopColor="#a21caf" />
            </linearGradient>
          </defs>
          {/* Rear of car */}
          <path d="M8 50 Q8 18 26 14 L60 14 Q78 18 78 50 Z" fill="url(#egoBody)" />
          <path d="M14 50 Q14 24 28 20 L58 20 Q72 24 72 50 Z" fill="#1e1b3a" opacity="0.6" />
          {/* Rear window */}
          <rect x="22" y="22" width="42" height="14" rx="3" fill="#0f172a" opacity="0.85" />
          {/* Tail lights */}
          <rect x="10" y="40" width="8" height="6" rx="1.5" fill="#fca5a5" />
          <rect x="68" y="40" width="8" height="6" rx="1.5" fill="#fca5a5" />
        </svg>
        {/* Sensor cone */}
        <div
          className={`mx-auto -mt-1 h-[46px] w-[100px] ${tooClose ? "opacity-95" : "opacity-65"}`}
          style={{
            background: tooClose
              ? "linear-gradient(to top, rgba(239,68,68,0.6), rgba(239,68,68,0))"
              : "linear-gradient(to top, rgba(56,189,248,0.55), rgba(56,189,248,0))",
            clipPath: "polygon(20% 100%, 80% 100%, 100% 0%, 0% 0%)",
            transform: "translateY(-46px) rotate(180deg)",
          }}
        />
      </div>

      {/* Too-close warning */}
      {tooClose && (
        <div className="absolute left-1/2 top-2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold text-white shadow-lg animate-fade-in">
          <AlertTriangle className="h-3.5 w-3.5" />
          {t("traffic.tooClose")}
        </div>
      )}

      {/* LIVE chip */}
      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> {t("traffic.live")}
      </div>
      {fullscreen && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
          {t("traffic.view360")}
        </div>
      )}
    </div>
  );
  if (!clickable || fullscreen) return inner;
  return <Link to="/traffic" className="block h-full w-full">{inner}</Link>;
}

function RoadCar({ topPct, side, delay, color, scale }: { topPct: number; side: "left" | "right" | "center"; delay: string; color: string; scale: number }) {
  const xOffset = side === "left" ? "-22%" : side === "right" ? "22%" : "0%";
  return (
    <div
      className="pointer-events-none absolute left-1/2"
      style={{
        top: `${topPct}%`,
        transform: `translate(calc(-50% + ${xOffset}), 0) scale(${scale})`,
        animation: `carDriveLeft 3s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <svg width="60" height="40" viewBox="0 0 60 40">
        <path d="M6 32 Q6 12 18 10 L42 10 Q54 12 54 32 Z" fill={color} />
        <rect x="14" y="14" width="32" height="10" rx="2" fill="#0f172a" opacity="0.7" />
        <rect x="8" y="26" width="6" height="4" rx="1" fill="#fca5a5" />
        <rect x="46" y="26" width="6" height="4" rx="1" fill="#fca5a5" />
      </svg>
    </div>
  );
}
