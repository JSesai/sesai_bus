import { useDashboard } from "../../auth/context/DashBoardContext";
import { Button } from "../../components/ui/button";
import Buses from "./Buses";
import RegisterBus from "./RegisterBus";
import type { handlerSteps } from "./SetupWizard";

export default function BusesStep({ onNext, onBack }: handlerSteps) {

  const { numberRegisteredVehicles } = useDashboard();



  return (
    <div className="space-y-6">

      {numberRegisteredVehicles > 0 ?
        < p className="text-cyan-100 text-md">
          Cantidad de vehículos registrados en el sistema: <span className="font-bold text-lg">{numberRegisteredVehicles}</span>
        </p>
        :
        <p className="text-slate-400 text-md">
          Puedes agregar varios vehículos. Al menos uno es obligatorio.
        </p>

      }

      <Buses configInitial={true} />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onNext} disabled={numberRegisteredVehicles === 0}>
          Continuar
        </Button>
      </div>
    </div >
  )
}
