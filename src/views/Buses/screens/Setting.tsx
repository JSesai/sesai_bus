import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

import ActionButton from "../components/AcctionButton";
import { Bus, BusIcon, Map, Route, User } from "lucide-react";





export default function Setting() {

    return (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-slate-100 text-xl">Gestiona la configuración del sistema</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    <ActionButton icon={BusIcon} size={'m'} label="Autobuses"/>
                    <ActionButton icon={Route} label="Rutas" />
                    <ActionButton icon={Map} label="Destinos" />
                    <ActionButton icon={User} label="Usuarios" />
                </div>
            </CardContent>
        </Card>
    )
}