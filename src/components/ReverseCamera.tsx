import { useEffect, useRef, useState } from "react";
import { Video, VideoOff } from "lucide-react";

/**
 * Reverse camera widget — uses the device webcam as a stand-in for a real
 * rear camera. Shows guide lines (green / yellow / red) overlay similar to
 * factory reverse cameras.
 */
export function ReverseCamera({
  className = "",
  fullscreen = false,
}: {
  className?: string;
  fullscreen?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setActive(true);
        }
      } catch (e: any) {
        setError(e?.message || "Camera unavailable");
      }
    })();
    return () => {
      cancelled = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div
      className={[
        fullscreen
          ? "fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none"
          : "relative overflow-hidden rounded-[24px] bg-black shadow-sm ring-1 ring-black/5",
        className,
      ].join(" ")}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        className="h-full w-full object-cover"
      />
      {/* Guide lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Outer red */}
        <path d="M10 95 L25 55 L75 55 L90 95" stroke="#ef4444" strokeWidth="0.8" fill="none" />
        {/* Mid yellow */}
        <path d="M18 95 L30 65 L70 65 L82 95" stroke="#facc15" strokeWidth="0.8" fill="none" />
        {/* Inner green */}
        <path d="M28 95 L36 75 L64 75 L72 95" stroke="#22c55e" strokeWidth="0.8" fill="none" />
        {/* Cross lines */}
        <line x1="22" y1="78" x2="78" y2="78" stroke="#facc15" strokeWidth="0.4" strokeDasharray="2 2" />
      </svg>

      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
        {active ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />}
        REVERSE CAM
      </div>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-3 text-center text-[10px] text-white">
          {error}<br />Allow camera access to enable reverse view
        </div>
      )}
    </div>
  );
}
