import { ArrowUp01, Bus } from "lucide-react";
import { MenuCard } from "../components/MenuCard";

const menuItems = [
    {
        title: "Configuracion de automoviles",
        description: "Agrega, edita o elimina unidades",
        icon: Bus,
        path: "/dashboard/buses",
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
        hoverColor: "hover:border-blue-500",
    },
    {
        title: "Asignacion diaria de numeros",
        description: "Gestiona los números de los vehiculos registrados",
        icon: ArrowUp01,
        path: "/dashboard/bus-daily-assignment",
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        hoverColor: "hover:border-pink-500",
    },
  
]

export function BusesSetting(){


    return(
        <MenuCard titleMenu="Gestión de vehiculos" description="Administra y gestiona la flotatilla de automoviles" menu={menuItems}/>
    )
}