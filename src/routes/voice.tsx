import { createFileRoute } from "@tanstack/react-router";
import { TrafficWidget } from "@/components/TrafficWidget";
import { MapWidget } from "@/components/MapWidget";
import { GearPanel } from "@/components/GearPanel";
import { MediaCard } from "@/components/MediaCard";
import { ClimateCard } from "@/components/ClimateCard";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CockpitLayout } from "@/components/CockpitLayout";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/voice")({ component: VoicePage });

function VoicePage() {
  const { t } = useTranslation();
  const [transcript, setTranscript] = useState(t("voice.listening"));
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);
  const { playBeep, language, musicExpanded, setMusicExpanded } = useApp();
  const toggleMusic = () => setMusicExpanded(!musicExpanded);

  useEffect(() => {
    setTranscript(t("voice.listening"));
  }, [t]);

  useEffect(() => {
    const W = window as any;
    const SRClass = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SRClass) { setTranscript(t("voice.notSupported")); return; }
    const langMap: Record<string, string> = {
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
    const r = new SRClass();
    r.continuous = true;
    r.interimResults = true;
    r.lang = langMap[language] ?? language ?? "en-US";
    r.onresult = (e: any) => {
      const text = Array.from(e.results).map((res: any) => res[0].transcript).join("");
      setTranscript(text || t("voice.listening"));
    };
    r.onstart = () => { setListening(true); playBeep("chime"); };
    r.onend = () => setListening(false);
    recogRef.current = r;
    try { r.start(); } catch {}
    return () => { try { r.stop(); } catch {} };
  }, [playBeep, language, t]);

  return (
    <div className="relative h-full">
      {/* Listening overlay — 472×217 ratio scaled to ~292×135 */}
      <div className="pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2" style={{ width: 292 }}>
        <div className="pointer-events-auto flex h-[135px] flex-col items-center justify-center gap-2 rounded-[24px] bg-[var(--panel)]/95 px-4 shadow-2xl ring-1 ring-black/10 backdrop-blur">
          <div className={`relative flex h-12 w-12 items-center justify-center rounded-full ${listening ? "bg-[var(--brand)]/20" : "bg-[var(--panel-soft)]"}`}>
            {listening && <span className="absolute inset-0 animate-ping rounded-full bg-[var(--brand)]/30" />}
            <Mic className={`h-6 w-6 ${listening ? "text-[var(--brand)]" : "text-foreground/60"}`} />
          </div>
          <span className="line-clamp-1 font-extrabold leading-none text-2xl">{transcript}</span>
        </div>
      </div>

      <CockpitLayout
        leftTop={musicExpanded ? <MediaCard expanded onToggleExpand={toggleMusic} /> : <TrafficWidget className="h-full w-full" />}
        leftTopLarge={musicExpanded}
        leftMiddle={musicExpanded ? undefined : <MediaCard onToggleExpand={toggleMusic} />}
        leftBottom={<ClimateCard />}
        centerTop={<MapWidget className="h-full w-full" />}
        centerBottom={<BrightnessCard />}
        rightTop={<GearPanel />}
        rightBottom={<StatusCard />}
      />
    </div>
  );
}
