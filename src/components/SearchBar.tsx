import { useNavigate } from "@tanstack/react-router";
import { Mic, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

const TARGETS: { kw: string[]; to: string; labelKey: string }[] = [
  { kw: ["set", "setting", "settings", "language", "font", "theme", "brightness"], to: "/settings", labelKey: "sidebar.settings" },
  { kw: ["map", "navigation", "destination", "route", "gps"], to: "/map", labelKey: "search.quickNavigation" },
  { kw: ["voice", "mic", "command", "listen", "speak"], to: "/voice", labelKey: "sidebar.voice" },
  { kw: ["bluetooth", "phone", "pair", "device", "auto-connect", "phone-auto-connect"], to: "/bluetooth", labelKey: "search.quickPhoneConnect" },
  { kw: ["car", "drive", "driving", "mode", "cruise", "lane", "park", "parking", "auto-parking"], to: "/car", labelKey: "search.quickAutoParking" },
  { kw: ["home", "dashboard", "main"], to: "/", labelKey: "search.quickNavigation" },
];

const QUICK = [
  { key: "search.quickAutoParking", to: "/car" },
  { key: "search.quickPhoneConnect", to: "/bluetooth" },
  { key: "search.quickAdaptiveCruise", to: "/car" },
  { key: "search.quickLaneCentering", to: "/car" },
  { key: "search.quickNavigation", to: "/map" },
];

type SR = any;

export function SearchBar() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [micPinned, setMicPinned] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recogRef = useRef<SR | null>(null);
  const nav = useNavigate();
  const { playBeep, gear, language } = useApp();
  const reversing = gear === "R";

  const speechLang = useMemo(() => {
    const map: Record<string, string> = {
      en: "en-US",
      ms: "ms-MY",
      ta: "ta-IN",
      "zh-Hans": "zh-CN",
      "zh-Hant": "zh-TW",
      iba: "ms-MY",
      melanau: "ms-MY",
      bidayuh: "ms-MY",
      kelabit: "ms-MY",
      es: "es-ES",
    };
    return map[language] ?? language ?? "en-US";
  }, [language]);

  useEffect(() => {
    const W = typeof window !== "undefined" ? (window as any) : null;
    const SRClass = W?.SpeechRecognition || W?.webkitSpeechRecognition;
    if (!SRClass) return;
    const r: SR = new SRClass();
    r.continuous = true;
    r.interimResults = true;
    r.lang = speechLang;
    r.onresult = (e: any) => {
      const text = Array.from(e.results).map((res: any) => res[0].transcript).join("");
      setQ(text);
      setFocused(true);
      setForceOpen(true);
    };
    r.onstart = () => { setListening(true); setFocused(true); setForceOpen(true); playBeep("chime"); };
    r.onend = () => {
      setListening(false);
      if (micPinned) {
        try { r.start(); } catch {}
      }
    };
    r.onerror = () => { setListening(false); setMicError(t("voice.notSupported")); };
    recogRef.current = r;
  }, [micPinned, playBeep, speechLang, t]);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return TARGETS.filter((t) => t.kw.some((k) => k.includes(s) || s.includes(k))).slice(0, 5);
  }, [q]);

  const go = (to: string) => {
    setQ(""); setFocused(false); setForceOpen(false);
    if (listening) { try { recogRef.current?.stop(); } catch {} setListening(false); }
    nav({ to: to as "/" });
  };

  const toggleMic = () => {
    const r = recogRef.current;
    if (!r) {
      // Fallback for browsers without SpeechRecognition.
      nav({ to: "/voice" });
      return;
    }
    if (listening) {
      setMicPinned(false);
      r.stop();
      setListening(false);
    }
    else {
      try {
        setMicError(null);
        r.lang = speechLang;
        setMicPinned(true);
        r.start();
        setListening(true);
        setFocused(true);
        setForceOpen(true);
      } catch {
        // Some engines throw if start() is called too quickly; retry once.
        try {
          r.stop();
          window.setTimeout(() => {
            try {
              r.lang = speechLang;
              setMicPinned(true);
              r.start();
              setListening(true);
              setFocused(true);
              setForceOpen(true);
            } catch {
              setMicError(t("voice.notSupported"));
            }
          }, 120);
        } catch {
          setMicError(t("voice.notSupported"));
        }
      }
    }
  };

  const onSearch = () => {
    if (matches[0]) return go(matches[0].to);
    if (q.trim()) go("/voice");
  };

  const suggestions = matches.length > 0
    ? matches.map((m) => ({ label: t(m.labelKey), to: m.to }))
    : QUICK.map((q) => ({ label: t(q.key), to: q.to }));

  return (
    <div className="relative" style={{ width: 274 }}>
      {/* Search bar — 274×52 ≈ 442×95 ratio (4.65:1) */}
      <div
        className={[
          "relative flex items-center gap-2 rounded-full bg-[var(--panel)] px-4 shadow-sm ring-1 ring-black/5",
          reversing ? "opacity-40 pointer-events-none" : "",
        ].join(" ")}
        style={{ height: 52 }}
        aria-disabled={reversing}
      >
        {reversing && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-white">
            LOCKED
          </div>
        )}
        <button
          onClick={toggleMic}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${listening ? "bg-[var(--brand)] text-white animate-mic-pulse" : "text-foreground/70 hover:bg-[var(--active)]"}`}
          aria-label={t("search.voiceSearch")}
        >
          <Mic className="h-4 w-4" />
        </button>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setForceOpen(true); }}
          onFocus={() => { setFocused(true); setForceOpen(true); }}
          onBlur={() => setTimeout(() => { setFocused(false); if (!listening) setForceOpen(false); }, 150)}
          onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
          placeholder={reversing ? t("topbar.searchLocked") : t("topbar.searchBar")}
          className="flex-1 bg-transparent outline-none placeholder:text-foreground/55 text-sm"
        />
        <button onClick={onSearch} className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 hover:bg-[var(--active)]" aria-label="Search">
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* Listening overlay — 292×135 ≈ 472×217 ratio (2.18:1) */}
      {listening && (
        <div className="absolute right-0 top-[60px] z-[1000] overflow-hidden rounded-[24px] bg-[var(--panel)] shadow-2xl ring-1 ring-black/10" style={{ width: 292, height: 135 }}>
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)]/15">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--brand)]/30" />
              <Mic className="h-6 w-6 text-[var(--brand)]" />
            </div>
            <div className="text-[12px] font-bold text-foreground">{t("voice.listening")}</div>
            <div className="line-clamp-1 text-[11px] text-foreground/70">{q || t("voice.sayCommand")}</div>
            <button
              onClick={toggleMic}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--panel-soft)] hover:bg-[var(--active)]"
              aria-label={t("search.stop")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {micError && (
        <div className="absolute right-0 top-[60px] z-[1000] rounded-xl bg-black/70 px-3 py-2 text-[11px] text-white">
          {micError}
        </div>
      )}

      {/* Suggestions dropdown */}
      {!listening && (focused || forceOpen) && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[60px] z-[1000] overflow-hidden rounded-2xl bg-[var(--panel)] shadow-xl ring-1 ring-black/5">
          {suggestions.map((m) => (
            <button
              key={m.label + m.to}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(m.to)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] hover:bg-[var(--active)]"
            >
              <Search className="h-3.5 w-3.5 opacity-60" />
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
