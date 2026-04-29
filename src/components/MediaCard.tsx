import { useApp } from "@/lib/app-context";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import healTheWorld from "@/assets/heal-the-world.mp3";
import drivingLight from "@/assets/driving-light.mp3";
import kalimba from "@/assets/kalimba.mp3";

const PLAYLIST = [
  { title: "Heal the World", artist: "Michael Jackson", src: healTheWorld },
  { title: "Driving Light", artist: "Ambient", src: drivingLight },
  { title: "Kalimba", artist: "Mr. Scruff", src: kalimba },
  { title: "Shape of You", artist: "Ed Sheeran", src: drivingLight },
  { title: "White Christmas", artist: "Bing Crosby", src: kalimba },
  { title: "Hey Jude", artist: "The Beatles", src: healTheWorld },
];

interface Props { expanded?: boolean; onToggleExpand?: () => void }

export function MediaCard({ expanded = false, onToggleExpand }: Props) {
  const { playing, setPlaying, progress, setProgress, volume, setVolume } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIdx, setTrackIdx] = useState(0);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing, trackIdx, setPlaying]);
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const onTime = () => { if (a.duration) setProgress(a.currentTime / a.duration); };
    a.addEventListener("timeupdate", onTime);
    return () => a.removeEventListener("timeupdate", onTime);
  }, [setProgress]);

  const seek = (v: number) => {
    setProgress(v);
    const a = audioRef.current;
    if (a && a.duration) a.currentTime = v * a.duration;
  };
  const skip = (delta: number) => {
    const next = (trackIdx + delta + PLAYLIST.length) % PLAYLIST.length;
    setTrackIdx(next);
    setProgress(0);
  };

  const cur = PLAYLIST[trackIdx];

  if (expanded) {
    return (
      <div className="relative flex h-full w-full flex-col gap-1.5 rounded-[24px] bg-[var(--panel)] p-2 shadow-sm ring-1 ring-black/5 animate-fade-in">
        <audio ref={audioRef} src={cur.src} onEnded={() => skip(1)} preload="auto" />
        <div className="relative h-[112px] overflow-hidden rounded-[16px] bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute left-3 top-2 text-[28px] font-extrabold italic tracking-tight text-white drop-shadow">FLOWERS</div>
          <div className="absolute left-3 top-[40px] text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90">MILEY CYRUS</div>
        </div>
        <div className="rounded-[12px] bg-[var(--panel-soft)] px-2 py-1">
          <div className="truncate text-[12px] font-semibold">{cur.title}</div>
          <div className="mt-0.5 flex items-center gap-2">
            <button className="text-foreground/70" aria-label="Repeat"><Repeat className="h-3.5 w-3.5" /></button>
            <button onClick={() => skip(-1)} aria-label="Previous"><SkipBack className="h-4 w-4" /></button>
            <button onClick={() => setPlaying(!playing)} className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background" aria-label="Play/Pause">
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => skip(1)} aria-label="Next"><SkipForward className="h-4 w-4" /></button>
            <button className="ml-auto text-foreground/70" aria-label="Shuffle"><Shuffle className="h-3.5 w-3.5" /></button>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <input
              type="range" min={0} max={1} step={0.001} value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="h-1 flex-1 accent-[var(--brand)]"
              aria-label="Progress"
            />
            <Volume2 className="h-3 w-3" />
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-1 w-10 accent-[var(--brand)]"
              aria-label="Volume"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-[var(--panel-soft)] p-1">
          {PLAYLIST.map((t, i) => (
            <button
              key={i}
              onClick={() => { setTrackIdx(i); setPlaying(true); }}
              className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[9.5px] leading-tight ${i === trackIdx ? "bg-[var(--brand)]/15 font-bold text-[var(--brand)]" : "hover:bg-black/5"}`}
            >
              <span className="truncate">{t.title}</span>
              <span className="ml-auto truncate text-foreground/50">- {t.artist}</span>
            </button>
          ))}
        </div>
        {onToggleExpand && (
          <button onClick={onToggleExpand} className="absolute right-3 top-3 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50" aria-label="Collapse">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  // Compact card
  const canExpand = !!onToggleExpand;
  return (
    <div
      className={`flex h-full w-full flex-col justify-center gap-1 rounded-[24px] bg-[var(--panel)] px-3 py-2 shadow-sm ring-1 ring-black/5 transition ${
        canExpand ? "cursor-pointer hover:ring-black/10" : ""
      }`}
      onClick={canExpand ? onToggleExpand : undefined}
    >
      <audio ref={audioRef} src={cur.src} onEnded={() => skip(1)} preload="auto" />
      <div className="truncate text-center font-semibold leading-none text-foreground/70 text-lg">{cur.title}</div>
      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <button className="text-foreground/70" aria-label="Repeat"><Repeat className="h-4 w-4" /></button>
        <button onClick={() => skip(-1)} aria-label="Previous"><SkipBack className="h-5 w-5" /></button>
        <button onClick={() => setPlaying(!playing)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--panel-soft)] hover:bg-[var(--active)]" aria-label="Play/Pause">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button onClick={() => skip(1)} aria-label="Next"><SkipForward className="h-5 w-5" /></button>
        <button className="text-foreground/70" aria-label="Shuffle"><Shuffle className="h-4 w-4" /></button>
      </div>
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <input
          type="range" min={0} max={1} step={0.001} value={progress}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="h-1 flex-1 accent-[var(--brand)]"
          aria-label="Progress"
        />
        <Volume2 className="h-3 w-3" />
        <input
          type="range" min={0} max={1} step={0.01} value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="h-1 w-10 accent-[var(--brand)]"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
