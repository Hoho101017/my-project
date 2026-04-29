import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Settings, Map, Mic, Bluetooth, Car } from "lucide-react";
import logo from "@/assets/hkt-logo.png";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

const items = [
  { to: "/settings", icon: Settings, key: "settings" },
  { to: "/map", icon: Map, key: "map" },
  { to: "/voice", icon: Mic, key: "voice" },
  { to: "/bluetooth", icon: Bluetooth, key: "bluetooth" },
  { to: "/car", icon: Car, key: "car" },
] as const;

// Sidebar width 60 ≈ 139 ratio scaled. Active strip height 74 ≈ 120 ratio.
export function Sidebar() {
  const { t } = useTranslation();
  const { location } = useRouterState();
  const path = location.pathname;
  const navigate = useNavigate();
  const { gear } = useApp();
  const reversing = gear === "R";
  return (
    <aside className={`flex w-[60px] shrink-0 flex-col items-center py-3 ${reversing ? "bg-transparent" : "bg-[var(--sidebar-bg)]"}`}>
      <Link to="/" className="mb-4 flex h-[52px] w-[52px] items-center justify-center" aria-label="Home">
        <img src={logo} alt="HKI Logo" className="h-[46px] w-[46px] object-contain" draggable={false} />
      </Link>
      <div className="flex flex-1 flex-col items-stretch gap-2 self-stretch px-0 pt-2">
        {items.map(({ to, icon: Icon, key }) => {
          const active = path.startsWith(to);
          const label = t(`sidebar.${key}`);
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              title={`${label} (double-tap to go home)`}
              onDoubleClick={(e) => {
                e.preventDefault();
                navigate({ to: "/" });
              }}
              className={`flex h-[68px] w-full items-center justify-center transition-colors ${
                active ? "bg-[var(--active)] text-foreground" : "text-foreground/85 hover:bg-[var(--active)]/50"
              }`}
            >
              <Icon className="h-[30px] w-[30px]" strokeWidth={1.6} />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
