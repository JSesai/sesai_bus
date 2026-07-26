import { useMemo } from "react";
import { useFontScale } from "./useFontScale";

interface Props {
  departure: DepartureBoardData;
  index: number;
}

function getDepartureStatus(departure: DepartureBoardData) {
  const now = new Date();
  const [h, m] = departure.departure_time.split(":").map(Number);
  const departureDate = new Date();
  departureDate.setHours(h, m, 0, 0);

  const diffMs = departureDate.getTime() - now.getTime();
  const diffMin = diffMs / 60000;

  if (departure.status === "disabled" || departure.status === "removed") {
    return { label: "Cancelado", color: "text-red-400", bg: "bg-red-500/10", pulse: false };
  }

  if (diffMin < -5) {
    return { label: "Salido", color: "text-slate-500", bg: "bg-slate-500/10", pulse: false };
  }

  if (diffMin >= -5 && diffMin < 0) {
    return { label: "Abordando", color: "text-blue-400", bg: "bg-blue-500/15", pulse: true };
  }

  if (diffMin >= 0 && diffMin <= 15) {
    return { label: "Próxima", color: "text-amber-400", bg: "bg-amber-500/15", pulse: true };
  }

  if (diffMin > 15 && diffMin <= 30) {
    return { label: "A Tiempo", color: "text-emerald-400", bg: "bg-emerald-500/10", pulse: false };
  }

  return { label: "Programado", color: "text-slate-300", bg: "bg-slate-500/10", pulse: false };
}

export default function DepartureRow({ departure, index }: Props) {
  const status = useMemo(() => getDepartureStatus(departure), [departure]);
  const availableSeats = departure.seatingCapacity - departure.occupied_seats;
  const isSalido = status.label === "Salido";
  const { s } = useFontScale();

  return (
    <div
      className={`wr-row grid gap-5 items-center border-b border-slate-700/50 hover:bg-slate-700/20 transition-all duration-300 ${isSalido ? "opacity-40" : ""}`}
      style={{
        gridTemplateColumns: `${s(140)} 1fr ${s(160)} ${s(130)} ${s(160)} ${s(170)}`,
        padding: `${s(20)} ${s(32)}`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Hora de salida */}
      <div className={`font-mono font-bold leading-none ${isSalido ? "text-slate-500 line-through" : "text-white"}`} style={{ fontSize: s(40) }}>
        {departure.departure_time}
      </div>

      {/* Destino */}
      <div className="flex flex-col">
        <span className={`font-semibold leading-tight ${isSalido ? "text-slate-500" : "text-white"}`} style={{ fontSize: s(24) }}>
          {departure.city_destination}
        </span>
        <span className="text-slate-400" style={{ fontSize: s(14), marginTop: s(2) }}>{departure.terminal_destination}</span>
      </div>

      {/* Unidad */}
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-slate-700/50 font-semibold text-slate-200" style={{ padding: `${s(6)} ${s(16)}`, fontSize: s(18) }}>
          #{departure.vehicle_number}
        </span>
      </div>

      {/* Asientos */}
      <div className="text-center">
        <span className={`font-bold ${availableSeats <= 5 ? "text-red-400" : "text-emerald-400"}`} style={{ fontSize: s(24) }}>
          {availableSeats}
        </span>
        <span className="text-slate-500" style={{ fontSize: s(16) }}> / {departure.seatingCapacity}</span>
      </div>

      {/* Chofer */}
      <div className="text-slate-400 truncate" style={{ fontSize: s(16) }}>{departure.driver_name}</div>

      {/* Estado */}
      <div className="flex justify-end">
        <span className={`wr-status-badge rounded-full font-bold uppercase tracking-wider ${status.color} ${status.bg} ${status.pulse ? "wr-pulse" : ""}`} style={{ padding: `${s(6)} ${s(16)}`, fontSize: s(14) }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
