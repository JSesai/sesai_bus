import { Button } from "../../components/ui/button";
import RegisterBus from "./RegisterBus";
import type { handlerSteps } from "./SetupWizard";

export default function BusesStep({ onNext, onBack }: handlerSteps) {

    return (
      <div className="space-y-6">
  
        <p className="text-slate-400 text-sm">
          Puedes agregar varios autobuses. Al menos uno es obligatorio.
        </p>
  
        <RegisterBus editingBus={null} />
  
        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            Atrás
          </Button>
          <Button onClick={onNext}>
            Continuar
          </Button>
        </div>
      </div>
    )
  }
  