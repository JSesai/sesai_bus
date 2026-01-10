




import { useDashboard } from "../../auth/context/DashBoardContext"
import { Button } from "../../components/ui/button"
import AgencieForm from "../components/AgencieForm"
import DestinoForm from "../components/DestinoForm"
import DestinationsManager from "./Destinations"
import DestinosManager from "./Destinations"
import type { handlerSteps } from "./SetupWizard"

export default function RoutesStep({ onNext, onBack }: handlerSteps) {

    const { numberRegisteredDestinations } = useDashboard();


    return (
        <div className="space-y-6">

            <DestinationsManager configInitial={true} />


            <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    Atrás
                </Button>
                <Button onClick={onNext} disabled={numberRegisteredDestinations === 0}>
                    Continuar
                </Button>
            </div>
        </div>
    )
}
