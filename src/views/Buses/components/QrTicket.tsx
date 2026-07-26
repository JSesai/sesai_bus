import { useState, useEffect } from "react";
import { generateQrDataUri } from "../../shared/utils/qrGenerator";

interface QrTicketProps {
  data: string;
  size?: number;
  className?: string;
}

export function QrTicket({ data, size = 120, className }: QrTicketProps) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;
    generateQrDataUri(data, size).then((uri) => {
      if (!cancelled) setSrc(uri);
    });
    return () => { cancelled = true; };
  }, [data, size]);

  if (!src) return <div style={{ width: size, height: size }} />;

  return (
    <img
      src={src}
      width={size}
      height={size}
      className={className}
      alt="QR Code"
    />
  );
}
