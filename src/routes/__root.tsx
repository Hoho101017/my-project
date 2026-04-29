import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppProvider, useApp } from "@/lib/app-context";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ReverseCamera } from "@/components/ReverseCamera";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">{t("notFound.title")}</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{t("notFound.goHome")}</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HKI Smart Cockpit" },
      { name: "description", content: "Tablet cockpit interface — navigation, voice, climate and more." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function Frame() {
  const { brightness, gear, setGear } = useApp();
  const reversing = gear === "R";
  const [showGearHint, setShowGearHint] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.altKey || e.metaKey) return;
      const k = e.key.toLowerCase();
      if (k === "p" || k === "r" || k === "n" || k === "d") {
        e.preventDefault();
        setGear(k.toUpperCase() as "P" | "R" | "N" | "D");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setGear]);

  useEffect(() => {
    if (!reversing) return;
    setShowGearHint(true);
    const t = window.setTimeout(() => setShowGearHint(false), 4500);
    return () => window.clearTimeout(t);
  }, [reversing]);

  if (reversing) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4" style={{ background: "var(--app-bg)" }}>
        <div
          className="relative z-10 overflow-hidden rounded-[28px] border-2 shadow-2xl transition-[filter] duration-700 ease-out"
          style={{
            width: 960,
            height: 690,
            borderColor: "var(--app-border)",
            background: "var(--background)",
            filter: `brightness(${brightness})`,
          }}
        >
          <div className="flex h-full w-full">
            <Sidebar />
            <div className="relative flex h-full flex-1 flex-col">
              <TopBar />
              <main className="relative z-0 flex-1 overflow-hidden px-4 pb-3">
                <ReverseCamera className="h-full w-full" />
              </main>
              {showGearHint && (
                <div className="absolute left-1/2 top-2 z-[500] -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  Tip: Press Ctrl+P / Ctrl+N / Ctrl+D to change gear
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4" style={{ background: "var(--app-bg)" }}>
      <div
        className="relative z-10 overflow-hidden rounded-[28px] border-2 shadow-2xl transition-[filter] duration-700 ease-out"
        style={{
          width: 960,
          height: 690,
          borderColor: "var(--app-border)",
          background: "var(--background)",
          filter: `brightness(${brightness})`,
        }}
      >
        <div className="flex h-full w-full">
          <Sidebar />
          <div className="relative flex h-full flex-1 flex-col">
            <TopBar />
            <main className="relative z-0 flex-1 overflow-visible px-4 pb-3">
              <Outlet />
            </main>

          </div>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppProvider>
        <Frame />
      </AppProvider>
    </I18nextProvider>
  );
}

