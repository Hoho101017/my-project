import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/pair")({ component: PairPage });

const NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Cameron", "Sage", "Nova", "Phoenix"];

function PairPage() {
  const [name, setName] = useState("");
  useEffect(() => {
    const n = NAMES[Math.floor(Math.random() * NAMES.length)] + "-" + (Math.floor(Math.random() * 90) + 10);
    setName(n);
    // Persist to localStorage so settings page can pick it up
    try {
      localStorage.setItem("hki:linkedPhone", n);
      localStorage.setItem("hki:linkedAt", Date.now().toString());
    } catch {}
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 text-xs flex-col gap-4 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <h1 className="text-2xl font-bold">Phone Linked!</h1>
      <p className="text-foreground/70">Your device has been paired as:</p>
      <div className="rounded-2xl bg-[var(--panel)] px-6 py-3 text-3xl font-extrabold text-[var(--brand)] shadow ring-1 ring-black/10">
        {name}
      </div>
      <Link to="/settings" className="mt-4 rounded-full bg-[var(--brand)] px-6 py-2 text-sm font-semibold text-white">
        Back to Settings
      </Link>
    </div>
  );
}
