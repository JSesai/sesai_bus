

import { Button } from "../../components/ui/button"
import AgencieForm from "../components/AgencieForm"
import type { handlerSteps } from "./SetupWizard"

export default function AgencyStep({ onNext }: handlerSteps) {


   

    return (
        <div className="space-y-6">

            <AgencieForm />

            <div className="flex justify-end">
                <Button onClick={onNext}>
                    Guardar y continuar
                </Button>
            </div>
        </div>
    )
}
