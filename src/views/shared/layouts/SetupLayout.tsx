import { Outlet } from "react-router-dom";



export default function SetupLayout() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 flex items-center justify-center px-6">
        <div className="w-full max-w-3xl bg-slate-900/80 border border-slate-700 rounded-xl shadow-xl p-8">
          <Outlet />
        </div>
      </div>
    )
  }
  