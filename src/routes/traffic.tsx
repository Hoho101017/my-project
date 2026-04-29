import { createFileRoute, Link } from "@tanstack/react-router";
import { TrafficWidget } from "@/components/TrafficWidget";
import { X } from "lucide-react";

export const Route = createFileRoute("/traffic")({ component: TrafficPage });

function TrafficPage() {
  return (
    <div className="relative h-full w-full">
      <TrafficWidget className="h-full w-full rounded-none" clickable={false} fullscreen />
      <Link to="/" className="absolute right-3 top-3 z-20 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--panel)]/95 shadow-lg ring-1 ring-black/10 backdrop-blur" aria-label="Close">
        <X className="h-5 w-5" />
      </Link>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[var(--panel)]/92 px-4 py-2 text-[11px] font-semibold shadow-lg ring-1 ring-black/10 backdrop-blur">
        Smart Traffic — drag to look around (360°)
      </div>
    </div>
  );
}
