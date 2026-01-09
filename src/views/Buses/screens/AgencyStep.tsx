

import { Button } from "../../components/ui/button"
import AgencieForm from "../components/AgencieForm"

export default function AgencyStep({ onNext }: { onNext: () => void }) {


   

    return (
        <div className="space-y-6">
            {/* <h2 className="text-xl font-semibold text-white">Datos de la agencia</h2> */}

            <AgencieForm />

            <div className="flex justify-end">
                <Button onClick={onNext}>
                    Guardar y continuar
                </Button>
            </div>
        </div>
    )
}
