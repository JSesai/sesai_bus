import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useEffect, useLayoutEffect, useState } from "react";

export default function FinishStep() {

  const [isConfigInitialComplete, setIsConfigInitialComplete] = useState(false);
  const { showConfetti } = useDashboard();
  const navigate = useNavigate()

  showConfetti();

  const finish = async () => navigate("/dashboard");



  useLayoutEffect(() => {
    window.electron.appConfig.updateAppConfig({ initial_setup_completed: 1 }).then(data => {
      if (data.ok) setIsConfigInitialComplete(true);
    })

  }, []);

  return (
    isConfigInitialComplete ?
      <div className="text-center space-y-6">

        <h2 className="text-2xl font-bold text-cyan-400">
          🎉 Configuración completa
        </h2>

        <p className="text-slate-400">
          Tu sistema está listo para operar.
        </p>

        <Button size="lg" onClick={finish}>
          Ir al dashboard
        </Button>
      </div>
      :
      <div className="text-center space-y-6">

        
        <Button size="lg" onClick={finish}>
          Ir al dashboard
        </Button>
      </div>

  )
}
