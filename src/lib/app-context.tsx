import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import i18n from "@/lib/i18n";

export type Theme = "light" | "dark" | "purple";

interface AppCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  setThemeManual: (t: Theme) => void;
  brightness: number;
  autoBrightness: boolean;
  setAutoBrightness: (v: boolean) => void;
  setBrightness: (v: number) => void;
  setBrightnessManual: (v: number) => void;
  autoTheme: boolean;
  setAutoTheme: (v: boolean) => void;
  fontScale: number;
  setFontScale: (v: number) => void;
  language: string;
  setLanguage: (v: string) => void;
  bluetoothOn: boolean;
  setBluetoothOn: (v: boolean) => void;
  pairedDevice: string | null;
  setPairedDevice: (v: string | null) => void;
  drivingMode: "adaptive" | "parking" | "lane";
  setDrivingMode: (v: "adaptive" | "parking" | "lane") => void;
  gear: "P" | "R" | "N" | "D";
  setGear: (g: "P" | "R" | "N" | "D") => void;
  temp: number;
  setTemp: (v: number) => void;
  acOn: boolean;
  setAcOn: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  progress: number;
  setProgress: (v: number) => void;
  batteryLevel: number;
  weather: { tempC: number; condition: string };
  linkedPhone: string | null;
  setLinkedPhone: (v: string | null) => void;
  musicExpanded: boolean;
  setMusicExpanded: (v: boolean) => void;
  playBeep: (kind: "warn" | "chime") => void;
}

const Ctx = createContext<AppCtx | null>(null);

const RANDOM_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn",
  "Cameron", "Sage", "Nova", "Phoenix", "River", "Skylar", "Drew", "Reese",
];

export function genRandomPhoneName() {
  const n = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
  const suffix = Math.floor(Math.random() * 90) + 10;
  return `${n}-${suffix}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [autoTheme, setAutoTheme] = useState(true);
  const [autoBrightness, setAutoBrightness] = useState(true);
  const [brightness, setBrightnessState] = useState(0.7);
  const [fontScale, setFontScale] = useState(1);
  const [language, setLanguageState] = useState<string>("en");
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [pairedDevice, setPairedDevice] = useState<string | null>(null);
  const [drivingMode, setDrivingMode] = useState<"adaptive" | "parking" | "lane">("adaptive");
  const [gear, setGear] = useState<"P" | "R" | "N" | "D">("D");
  const [temp, setTemp] = useState(19.5);
  const [acOn, setAcOn] = useState(true);
  const [volume, setVolume] = useState(0.4);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [weather, setWeather] = useState({ tempC: 24, condition: "Sunny" });
  const [linkedPhone, setLinkedPhone] = useState<string | null>(null);
  const [musicExpanded, setMusicExpanded] = useState(false);

  // Manual override: when user explicitly sets theme/brightness, disable auto + persist
  const setTheme = (t: Theme) => setThemeState(t);
  const setThemeManual = (t: Theme) => {
    setAutoTheme(false);
    setThemeState(t);
    try { localStorage.setItem("hki:theme", t); localStorage.setItem("hki:autoTheme", "0"); } catch {}
  };
  const setBrightness = (v: number) => setBrightnessState(v);
  const setBrightnessManual = (v: number) => { setAutoBrightness(false); setBrightnessState(v); };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hki:linkedPhone");
      if (saved) { setLinkedPhone(saved); setPairedDevice(saved); }
      const savedTheme = localStorage.getItem("hki:theme") as Theme | null;
      const savedAuto = localStorage.getItem("hki:autoTheme");
      if (savedTheme && savedAuto === "0") {
        setAutoTheme(false);
        setThemeState(savedTheme);
      }
      const savedLang = localStorage.getItem("hki:language");
      const lng = savedLang || "en";
      setLanguageState(lng);
      i18n.changeLanguage(lng).catch(() => {});
    } catch {}
  }, []);

  const setLanguage = (lng: string) => {
    setLanguageState(lng);
    try { localStorage.setItem("hki:language", lng); } catch {}
    i18n.changeLanguage(lng).catch(() => {});
  };

  // Battery API
  useEffect(() => {
    const nav = typeof navigator !== "undefined" ? (navigator as any) : null;
    if (!nav?.getBattery) return;
    let battery: any; let mounted = true;
    nav.getBattery().then((b: any) => {
      if (!mounted) return;
      battery = b;
      const update = () => setBatteryLevel(b.level);
      update();
      b.addEventListener("levelchange", update);
    }).catch(() => {});
    return () => { mounted = false; if (battery) battery.onlevelchange = null; };
  }, []);

  // Weather
  useEffect(() => {
    const fetchW = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
        .then((r) => r.json())
        .then((d) => {
          const t = Math.round(d.current?.temperature_2m ?? 24);
          const code = d.current?.weather_code ?? 0;
          let cond = "Sunny";
          if (code === 0) cond = "Sunny";
          else if (code <= 3) cond = "Cloudy";
          else if (code <= 67) cond = "Rainy";
          else if (code <= 77) cond = "Snowy";
          else cond = "Stormy";
          setWeather({ tempC: t, condition: cond });
        }).catch(() => {});
    };
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetchW(p.coords.latitude, p.coords.longitude),
        () => fetchW(1.5533, 110.3592),
        { timeout: 4000 }
      );
    } else fetchW(1.5533, 110.3592);
  }, []);

  // Auto theme: 06:00–18:59 light, else dark
  useEffect(() => {
    if (!autoTheme) return;
    const compute = () => {
      const h = new Date().getHours();
      setThemeState(h >= 6 && h < 19 ? "light" : "dark");
    };
    compute();
    const t = setInterval(compute, 60_000);
    return () => clearInterval(t);
  }, [autoTheme]);

  // Auto brightness: light→0.7, dark→0.85
  useEffect(() => {
    if (!autoBrightness) return;
    setBrightnessState(theme === "dark" ? 0.85 : 0.7);
  }, [autoBrightness, theme]);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "purple");
    if (theme !== "light") root.classList.add(theme);
    root.style.fontSize = `${16 * fontScale}px`;
  }, [theme, fontScale]);

  // Audio beep (lazy AudioContext)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playBeep = (kind: "warn" | "chime") => {
    try {
      const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctor();
      const ctx = audioCtxRef.current!;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      if (kind === "warn") {
        // Two short beeps, square 880Hz
        [0, 0.18].forEach((delay) => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = "square"; o.frequency.value = 880;
          g.gain.setValueAtTime(0.0001, now + delay);
          g.gain.exponentialRampToValueAtTime(0.18, now + delay + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.13);
          o.connect(g).connect(ctx.destination);
          o.start(now + delay); o.stop(now + delay + 0.15);
        });
      } else {
        // Pleasant ascending chime
        [523.25, 783.99].forEach((f, i) => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = "sine"; o.frequency.value = f;
          const d = i * 0.12;
          g.gain.setValueAtTime(0.0001, now + d);
          g.gain.exponentialRampToValueAtTime(0.15, now + d + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, now + d + 0.25);
          o.connect(g).connect(ctx.destination);
          o.start(now + d); o.stop(now + d + 0.28);
        });
      }
    } catch {}
  };

  return (
    <Ctx.Provider value={{
      theme, setTheme, setThemeManual,
      brightness, setBrightness, setBrightnessManual,
      autoBrightness, setAutoBrightness, autoTheme, setAutoTheme,
      fontScale, setFontScale, language, setLanguage,
      bluetoothOn, setBluetoothOn, pairedDevice, setPairedDevice,
      drivingMode, setDrivingMode, gear, setGear, temp, setTemp, acOn, setAcOn,
      volume, setVolume, playing, setPlaying, progress, setProgress,
      batteryLevel, weather, linkedPhone, setLinkedPhone, musicExpanded, setMusicExpanded, playBeep,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("AppProvider missing");
  return c;
};
