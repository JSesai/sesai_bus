import { useState, useEffect } from "react";
import { useFontScale } from "./useFontScale";

export default function WaitingRoomClock() {
  const [time, setTime] = useState(new Date());
  const { s } = useFontScale();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = time.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const date = time.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-end">
      <span className="font-mono font-bold tracking-wider text-white leading-none" style={{ fontSize: s(56) }}>
        {formatted}
      </span>
      <span className="text-slate-400 capitalize" style={{ fontSize: s(16), marginTop: s(4) }}>{date}</span>
    </div>
  );
}
