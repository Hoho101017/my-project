import { createFileRoute } from "@tanstack/react-router";
import { GearPanel } from "@/components/GearPanel";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { MapWidget } from "@/components/MapWidget";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { useApp, Theme } from "@/lib/app-context";
import { ChevronDown, Languages, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

type Lang = { code: string; label: string };

// Strict real languages in your requested order, then other real languages (no dummy placeholders).
const LANGS: Lang[] = [
  { code: "ms", label: "Bahasa Melayu" },
  { code: "en", label: "English" },
  { code: "iba", label: "Iban" },
  { code: "melanau", label: "Melanau" },
  { code: "bidayuh", label: "Bidayuh" },
  { code: "kelabit", label: "Kelabit" },
  { code: "zh-Hans", label: "简体中文" },
  { code: "zh-Hant", label: "繁體中文" },
  { code: "ta", label: "தமிழ்" },
  // Other languages
  { code: "id", label: "Bahasa Indonesia" },
  { code: "th", label: "ภาษาไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "tr", label: "Türkçe" },
  { code: "nl", label: "Nederlands" },
  { code: "sv", label: "Svenska" },
  { code: "pl", label: "Polski" },
  { code: "uk", label: "Українська" },
  { code: "fa", label: "فارسی" },
  { code: "bn", label: "বাংলা" },
  { code: "ur", label: "اردو" },
  { code: "fil", label: "Filipino" },
];
const THEMES: { v: Theme; label: string }[] = [
  { v: "light", label: "Light" }, { v: "dark", label: "Dark" }, { v: "purple", label: "Purple" }
];

function SettingsPage() {
  const { language, setLanguage, fontScale, setFontScale, theme, setThemeManual, linkedPhone, setLinkedPhone } = useApp();
  const { t } = useTranslation();
  const [openLang, setOpenLang] = useState(false);
  const [showFont, setShowFont] = useState(false);

  // Pick up scanned link from localStorage
  useEffect(() => {
    const check = () => {
      try {
        const n = localStorage.getItem("hki:linkedPhone");
        if (n && n !== linkedPhone) setLinkedPhone(n);
      } catch {}
    };
    check();
    const t = setInterval(check, 1500);
    return () => clearInterval(t);
  }, [linkedPhone, setLinkedPhone]);

  const pairUrl = typeof window !== "undefined" ? `${window.location.origin}/pair` : "/pair";
  const current = LANGS.find((l) => l.code === language) ?? LANGS[0];

  // Match baseline: settings panel height == map + gap + brightness
  const W_LEFT = 290;
  const W_CENTER = 290;
  const W_RIGHT = 268;
  const GAP_X = 10;
  const GAP_Y = 8;
  const H_CENTER_TOP = 460;
  const H_CENTER_BOT = 120;
  const H_LEFT_PANEL = H_CENTER_TOP + GAP_Y + H_CENTER_BOT;

  return (
    <div className="flex h-full w-full items-start justify-center pt-[2px]">
      <div className="flex" style={{ width: W_LEFT + W_CENTER + W_RIGHT + GAP_X * 2, gap: GAP_X }}>
        {/* LEFT column (Settings) */}
        <div className="flex flex-col" style={{ width: W_LEFT, height: H_LEFT_PANEL, gap: GAP_Y }}>
          <div className="flex h-full flex-col gap-[8px] rounded-[28px] bg-[var(--panel)] p-[12px] shadow-sm ring-1 ring-black/5">
            {/* Display Language */}
            <div>
              <div className="mb-[4px] flex items-center justify-center gap-2 text-center text-[13px] font-bold">
                <Languages className="h-4 w-4 text-foreground/70" />
                <span>{t("common.language")}</span>
              </div>
              <button
                onClick={() => setOpenLang(!openLang)}
                className="flex w-full items-center justify-between rounded-[14px] bg-[var(--panel-soft)] px-[12px] py-[8px] text-xs"
                aria-label="Select display language"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate">{current.label}</span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </button>
              {openLang && (
                <ul className="mt-[4px] max-h-32 overflow-auto rounded-[14px] bg-[var(--panel-soft)] text-xs shadow ring-1 ring-black/5">
                  {LANGS.map((l) => (
                    <li key={l.code}>
                      <button
                        onClick={() => { setLanguage(l.code); setOpenLang(false); }}
                        className="block w-full px-3 py-1 text-left hover:bg-[var(--active)]"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Phone Auto-Connect */}
            <div className="mt-[2px] flex flex-col items-center rounded-[18px] bg-[var(--panel-soft)] px-[8px] py-[10px]">
              <div className="mb-[6px] flex items-center gap-2 text-[13px] font-bold">
                <Smartphone className="h-4 w-4 text-foreground/70" />
                {t("common.phoneAutoConnect")}
              </div>
              <div className="rounded-[12px] bg-white p-[6px] ring-1 ring-black/10">
                <QRCodeDisplay value={pairUrl} size={88} />
              </div>
              <div className="mt-[6px] text-[10px] font-semibold text-foreground/60">
                {linkedPhone ? t("common.linked", { name: linkedPhone }) : t("common.unpaired")}
              </div>
              {linkedPhone && (
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.removeItem("hki:linkedPhone"); localStorage.removeItem("hki:linkedAt"); } catch {}
                    setLinkedPhone(null);
                  }}
                  className="mt-2 rounded-full bg-[var(--panel)] px-3 py-[6px] text-[11px] font-semibold hover:bg-[var(--active)]"
                >
                  {t("common.unlinkPhone")}
                </button>
              )}
            </div>

            {/* Customization */}
            <div className="mt-[2px] min-h-0 flex-1 overflow-auto rounded-[18px] bg-[var(--panel-soft)] px-[10px] py-[10px]">
              <div className="mb-[8px] text-center text-[13px] font-bold">{t("common.customization")}</div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowFont(!showFont)}
                  className="rounded-full bg-[var(--panel)] px-3 py-[7px] text-[11px] font-semibold transition active:scale-[0.98] hover:bg-[var(--active)]"
                >{t("common.changeFontSize")}</button>
                {showFont && (
                  <input
                    type="range" min={0.8} max={1.3} step={0.05} value={fontScale}
                    onChange={(e) => setFontScale(parseFloat(e.target.value))}
                    className="w-full accent-[var(--brand)]"
                  />
                )}
                <div className="text-center text-[10px] font-semibold tracking-wide text-foreground/60">{t("common.changeThemeColour")}</div>
                <div className="flex gap-2">
                  {THEMES.map((t) => {
                    const active = theme === t.v;
                    const bg = t.v === "purple"
                      ? "linear-gradient(135deg, oklch(0.55 0.22 320), oklch(0.45 0.20 295))"
                      : t.v === "dark"
                      ? "oklch(0.22 0.02 270)"
                      : "oklch(0.98 0.005 250)";
                    const fg = t.v === "light" ? "#1f2937" : "#fff";
                    return (
                      <button
                        key={t.v}
                        type="button"
                        onClick={() => setThemeManual(t.v)}
                        aria-pressed={active}
                        className={`flex-1 rounded-[12px] px-2 py-[8px] text-[11px] font-bold transition-all active:scale-[0.97] ${active ? "ring-2 ring-[var(--brand)] shadow-md" : "ring-1 ring-black/10 hover:ring-[var(--brand)]/60"}`}
                        style={{ background: bg, color: fg }}
                      >{t.label}</button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER column */}
        <div className="flex flex-col" style={{ width: W_CENTER, gap: GAP_Y }}>
          <div style={{ height: H_CENTER_TOP }}>
            <MapWidget className="h-full w-full" />
          </div>
          <div style={{ height: H_CENTER_BOT }}>
            <BrightnessCard />
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col" style={{ width: W_RIGHT, gap: GAP_Y }}>
          <div style={{ height: H_CENTER_TOP }}>
            <GearPanel />
          </div>
          <div style={{ height: H_CENTER_BOT }}>
            <StatusCard />
          </div>
        </div>
      </div>
    </div>
  );
}
