import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Bus, MapPin, Clock, Users, IdCardLanyard } from "lucide-react";

const menuItems = [
    {
        title: "Autobuses",
        description: "Gestionar unidades y flotas",
        icon: Bus,
        path: "/dashboard/buses",
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
        hoverColor: "hover:border-blue-500",
    },
    {
        title: "Destinos",
        description: "Administrar rutas y ciudades",
        icon: MapPin,
        path: "/dashboard/destinations",
        color: "text-green-600",
        bgColor: "bg-green-500/10",
        hoverColor: "hover:border-green-500",
    },
    {
        title: "Horarios",
        description: "Configurar salidas y llegadas",
        icon: Clock,
        path: "/dashboard/schedules",
        color: "text-orange-600",
        bgColor: "bg-orange-500/10",
        hoverColor: "hover:border-orange-500",
    },
    {
        title: "Usuarios",
        description: "Gestionar empleados y accesos",
        icon: IdCardLanyard,
        path: "/dashboard/employees",
        color: "text-purple-600",
        bgColor: "bg-purple-500/10",
        hoverColor: "hover:border-purple-500",
    },
    {
        title: "Clientes",
        description: "Gestionar clientes y datos",
        icon: Users,
        path: "/dashboard/customers",
        color: "text-cyan-600",
        bgColor: "bg-cyan-500/10",
        hoverColor: "hover:border-cyan-500",
    },
]

export default function AdminMenu() {
    return (
        <div className=" border-slate-700/50 backdrop-blur-sm overflow-hidden p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-balance mb-2">Panel de Administración</h1>
                <p className="text-muted-foreground text-pretty">Selecciona una opción para gestionar tu sistema de boletos</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 flex items-center justify-center">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link key={item.title} to={item.path} className="group">
                            <Card
                                className={`bg-slate-900/50 h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border-2 ${item.hoverColor}`}
                            >
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                    <div
                                        className={`w-16 h-16 rounded-full ${item.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}
                                    >
                                        <Icon className={`h-8 w-8 ${item.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground text-balance">{item.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
