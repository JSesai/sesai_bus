

import { useDashboard } from "../../auth/context/DashBoardContext"
import { Button } from "../../components/ui/button"
import AgencieForm from "../components/AgencieForm"
import type { handlerSteps } from "./SetupWizard"

export default function AgencyStep({ onNext }: handlerSteps) {


    const {agency} = useDashboard()
   

    return (
        <div className="space-y-6">

            <AgencieForm configInitial={true} />

            <div className="flex justify-end">
                <Button onClick={onNext} disabled={agency ? false : true}>
                    Continuar
                </Button>
            </div>
        </div>
    )
}
