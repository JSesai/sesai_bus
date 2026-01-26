


import { useDashboard } from "../../auth/context/DashBoardContext";
import { Button } from "../../components/ui/button"
import SchedulesManager from "../components/SchedulesManager"
import type { handlerSteps } from "./SetupWizard"

export default function SchedulesStep({ onNext, onBack }: handlerSteps) {


    const { numberRegisterSchedule } = useDashboard();
console.log(numberRegisterSchedule);


    return (
        <div className="space-y-6">

            <SchedulesManager configInitial={true}  />

            <div className="flex justify-end">

                <Button variant="outline" onClick={onBack}>
                    Atrás
                </Button>

                <Button onClick={onNext} disabled={numberRegisterSchedule === 0}>
                    continuar
                </Button>
            </div>
        </div>
    )
}
