import WaitingRoomClock from "./WaitingRoomClock";
import DepartureBoard from "./DepartureBoard";
import { useWaitingRoomData } from "./useWaitingRoomData";
import { useFontScale } from "./useFontScale";
import "./index.css";

export default function WaitingRoom() {
  const { departures, lastUpdate } = useWaitingRoomData();
  const { s } = useFontScale();

  return (
    <div className="wr-container min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#111827] to-[#0f172a] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-12 border-b border-slate-700/50" style={{ padding: `${s(32)} ${s(48)}` }}>
        <div className="flex items-center gap-5">
          <div className="wr-logo rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20" style={{ width: s(80), height: s(80) }}>
            <span className="text-white font-bold tracking-tight select-none" style={{ fontSize: s(32), textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>S</span>
          </div>
          <div>
            <h1 className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight" style={{ fontSize: s(44) }}>
              Salidas del Día
            </h1>
            <p className="text-slate-400 mt-1" style={{ fontSize: s(16) }}>Terminal de Autobuses</p>
          </div>
        </div>
        <WaitingRoomClock />
      </header>

      {/* Departures */}
      <main className="flex-1 overflow-y-auto" style={{ padding: `${s(32)} ${s(48)}` }}>
        <DepartureBoard departures={departures} />
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-slate-700/50 bg-slate-900/50" style={{ padding: `${s(20)} ${s(48)}` }}>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 wr-pulse-dot" />
          <span className="text-slate-400" style={{ fontSize: s(14) }}>
            Actualizado: {lastUpdate.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <span className="text-slate-500" style={{ fontSize: s(14) }}>Sistema de Taquilla SESAI</span>
      </footer>
    </div>
  );
}
