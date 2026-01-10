


import { Button } from "../../components/ui/button"
import AgencieForm from "../components/AgencieForm"
import SchedulesManager from "../components/SchedulesManager"
import type { handlerSteps } from "./SetupWizard"

export default function SchedulesStep({ onNext }: handlerSteps) {


   

    return (
        <div className="space-y-6">

            <SchedulesManager />

            <div className="flex justify-end">
                <Button onClick={onNext}>
                    Guardar y continuar
                </Button>
            </div>
        </div>
    )
}
