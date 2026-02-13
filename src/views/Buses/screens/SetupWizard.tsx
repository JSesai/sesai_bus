import { useState } from "react"
import AgencyStep from "./AgencyStep"
import BusesStep from "./BusesStep"
// import RoutesStep from "./steps/RoutesStep"
// import SchedulesStep from "./steps/SchedulesStep"
import FinishStep from "./FinishStep"
import { MonitorCog } from "lucide-react"
import RoutesStep from "./RoutesStep"
import SchedulesStep from "./SchedulesStep"
import DriverStep from "./DriverStep"

export type handlerSteps = {
    onNext?: () => void;
    onBack?: () => void;
}

const steps = [
    "Agencia",
    "Autobuses",
    "Rutas",
    "operadores",
    "Horarios",
    "Finalizar"
]



export default function SetupWizard() {
    const [step, setStep] = useState(0)

    const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
    const back = () => setStep((s) => Math.max(s - 1, 0))

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                        <MonitorCog />
                        Configuración inicial
                    </h1>

                </div>
                <p className="text-slate-400 text-sm">
                    Paso {step + 1} de {steps.length} — {steps[step]}
                </p>
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-8">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i <= step ? "bg-cyan-500" : "bg-slate-700"
                            }`}
                    />
                ))}
            </div>

            {/* Step content */}
            {step === 0 && <AgencyStep onNext={next} />}
            {step === 1 && <BusesStep onNext={next} onBack={back} />}
            {step === 2 && <RoutesStep onNext={next} onBack={back} />}
            {step === 3 && <DriverStep onNext={next} onBack={back} />}
            {step === 4 && <SchedulesStep onNext={next} onBack={back} />}
            {step === 5 && <FinishStep />}
        </>
    )
}
