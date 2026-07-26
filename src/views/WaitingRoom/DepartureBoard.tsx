import DepartureRow from "./DepartureRow";
import { useFontScale } from "./useFontScale";

interface Props {
  departures: DepartureBoardData[];
}

export default function DepartureBoard({ departures }: Props) {
  const { s } = useFontScale();

  if (departures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <svg className="mb-6 opacity-30" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6v6" />
          <path d="M16 6v6" />
          <path d="M2 12h20" />
          <path d="M18 18H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z" />
          <path d="M6 18v3" />
          <path d="M18 18v3" />
          <circle cx="8" cy="18" r="1" />
          <circle cx="16" cy="18" r="1" />
        </svg>
        <p className="text-slate-400" style={{ fontSize: s(28) }}>No hay salidas programadas para hoy</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="grid gap-5 items-center border-b-2 border-slate-600 mb-1"
        style={{
          gridTemplateColumns: `${s(140)} 1fr ${s(160)} ${s(130)} ${s(160)} ${s(170)}`,
          padding: `${s(16)} ${s(32)}`,
        }}
      >
        <span className="font-bold uppercase tracking-wider text-slate-400" style={{ fontSize: s(14) }}>Hora</span>
        <span className="font-bold uppercase tracking-wider text-slate-400" style={{ fontSize: s(14) }}>Destino</span>
        <span className="font-bold uppercase tracking-wider text-slate-400 text-center" style={{ fontSize: s(14) }}>Unidad</span>
        <span className="font-bold uppercase tracking-wider text-slate-400 text-center" style={{ fontSize: s(14) }}>Asientos</span>
        <span className="font-bold uppercase tracking-wider text-slate-400" style={{ fontSize: s(14) }}>Chofer</span>
        <span className="font-bold uppercase tracking-wider text-slate-400 text-right" style={{ fontSize: s(14) }}>Estado</span>
      </div>

      {/* Rows */}
      <div className="wr-board flex flex-col">
        {departures.map((dep, i) => (
          <DepartureRow key={dep.id} departure={dep} index={i} />
        ))}
      </div>
    </div>
  );
}
