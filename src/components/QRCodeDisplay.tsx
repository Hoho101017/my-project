import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({ value, size = 110, className = "" }: Props) {
  const [dataUrl, setDataUrl] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(value, { width: size, margin: 1, color: { dark: "#000000", light: "#ffffff" } })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [value, size]);
  if (!dataUrl) return <div style={{ width: size, height: size }} className={`bg-white ${className}`} />;
  return <img src={dataUrl} alt="QR Code" width={size} height={size} className={className} draggable={false} />;
}
