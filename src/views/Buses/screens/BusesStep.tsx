import { Button } from "../../components/ui/button";

export default function BusesStep({ onNext, onBack }: any) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Registrar autobuses</h2>
  
        <p className="text-slate-400 text-sm">
          Puedes agregar varios autobuses. Al menos uno es obligatorio.
        </p>
  
        {/* Reutiliza tu componente Buses pero en modo setup */}
  
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
  