
import { useDashboard } from "../../auth/context/DashBoardContext"
import { Button } from "../../components/ui/button"
import EmployeesManager from "../components/EmployeesManager";
import type { handlerSteps } from "./SetupWizard"

export default function DriverStep({ onNext, onBack }: handlerSteps) {

    const { numberRegisteredDriver } = useDashboard();


    return (
        <div className="space-y-6">

            <EmployeesManager configInitial={true} />


            <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    Atrás
                </Button>
                <Button onClick={onNext} disabled={numberRegisteredDriver === 0}>
                    Continuar
                </Button>
            </div>
        </div>
    )
}
