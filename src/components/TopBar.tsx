import { SearchBar } from "./SearchBar";
import { useEffect, useState } from "react";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now
    ? `${(now.getHours() % 12 || 12)}:${now.getMinutes().toString().padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`
    : "--:-- --";
  const date = now
    ? `${DAYS[now.getDay()]} | ${now.getDate()} ${MONTHS[now.getMonth()]}`
    : "--- | -- ---";

  return (
    <header className="relative z-[200] flex h-[68px] shrink-0 items-center justify-between px-4 pt-2 pb-3">
      <div className="flex flex-col leading-none">
        <span className="font-bold tracking-tight text-4xl">{time}</span>
        <span className="mt-2 font-semibold tracking-[0.15em] text-foreground/70 text-xs">{date}</span>
      </div>
      <SearchBar />
    </header>
  );
}
