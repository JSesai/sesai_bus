import { Bus, MapPin, Clock, Users, IdCardLanyard, HousePlug } from "lucide-react";
import { MenuCard } from "../components/MenuCard";

export type MenuItemSettings = {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    path: string;
    color: string;
    bgColor: string;
    hoverColor: string;
    accessRol: Rol[];
}

const menuItems: MenuItemSettings[] = [
    {
        title: "Agencia",
        description: "Gestionar configuración de la agencia",
        icon: HousePlug,
        path: "/dashboard/agencies",
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        hoverColor: "hover:border-pink-500",
        accessRol: ["developer", "manager"]
    },
    {
        title: "Autobuses",
        description: "Gestionar unidades y flotas",
        icon: Bus,
        path: "/dashboard/setting-bus",
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
        hoverColor: "hover:border-blue-500",
        accessRol: ["developer", "manager"]
    },
    {
        title: "Destinos",
        description: "Administrar rutas y ciudades",
        icon: MapPin,
        path: "/dashboard/destinations",
        color: "text-green-600",
        bgColor: "bg-green-500/10",
        hoverColor: "hover:border-green-500",
        accessRol: ["developer", "manager"]
    },
    {
        title: "Horarios",
        description: "Configurar salidas y llegadas",
        icon: Clock,
        path: "/dashboard/schedules",
        color: "text-orange-600",
        bgColor: "bg-orange-500/10",
        hoverColor: "hover:border-orange-500",
        accessRol: ["developer", "manager"]
    },
    {
        title: "Usuarios",
        description: "Gestionar empleados y accesos",
        icon: IdCardLanyard,
        path: "/dashboard/employees",
        color: "text-purple-600",
        bgColor: "bg-purple-500/10",
        hoverColor: "hover:border-purple-500",
        accessRol: ["developer", "manager"]
    },
    {
        title: "Clientes",
        description: "Gestionar clientes y datos",
        icon: Users,
        path: "/dashboard/customers",
        color: "text-cyan-600",
        bgColor: "bg-cyan-500/10",
        hoverColor: "hover:border-cyan-500",
        accessRol: ["developer", "manager"]

    },
]

export default function AdminMenu() {
    return (
        <MenuCard menu={menuItems} titleMenu="Panel de Administración" description="Selecciona una opción para gestionar tu sistema de boletos" />
    )
}
