import React, { useState } from "react"
import {
    Activity, Command, Globe, type LucideIcon,
    MessageSquare, Settings,
    Shield, Terminal, TicketPlus, LayoutDashboard, Bus,
    NotebookText, Monitor, Calculator, ScanLine, ScrollText
} from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Navigate, NavLink } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { useDashboard } from "../../auth/context/DashBoardContext";


interface MeuDash {
    label: string;
    path: string;
    end?: boolean;
    icon: LucideIcon,
    roles: Rol[],
}
export const menuDashboard: MeuDash[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        end: true,
        roles: ["manager", "developer", "ticketSeller"],
    },
    {
        label: "Resumen",
        path: "/dashboard/summary",
        icon: LayoutDashboard,
        roles: ["manager", "developer"],
    },
    {
        label: "Venta de boletos",
        path: "/dashboard/ticket-sale",
        icon: TicketPlus,
        roles: ["ticketSeller", "manager", "developer"],
    },
    {
        label: "Reservaciones",
        path: "/dashboard/confirmation-reservation",
        icon: NotebookText,
        roles: ["ticketSeller", "manager", "developer"],
    },
    {
        label: "Configuración",
        path: "/dashboard/setting",
        icon: Settings,
        roles: ["manager", "developer"],
    },
    {
        label: "Sala de Espera",
        path: "/dashboard/waiting-room",
        icon: Monitor,
        roles: ["manager", "developer"],
    },
    {
        label: "Corte de Caja",
        path: "/dashboard/cash-closing",
        icon: Calculator,
        roles: ["manager", "developer", "ticketSeller"],
    },
    {
        label: "Abordaje",
        path: "/dashboard/boarding",
        icon: ScanLine,
        roles: ["checkIn", "manager", "developer"],
    },
    {
        label: "Logs",
        path: "/dashboard/logs",
        icon: ScrollText,
        roles: ["manager", "developer"],
    },
];


interface NavItemProps {
    icon: LucideIcon;
    label: string;
    path: string;
    end?: boolean;
    onNavigate?: () => void;
}


// Component for nav items
export function NavItem({ icon: Icon, label, path, end, onNavigate }: NavItemProps) {
    const { agency } = useDashboard();

    if (!agency) {
        return (
            <Button disabled variant="ghost" className="w-full justify-start text-muted-foreground" >
                <Icon className="mr-2 h-4 w-4" /> {label}
            </Button>
        );
    }

    return (
        <NavLink to={path} end={end} className="w-full" onClick={onNavigate}>
            {({ isActive }) => (
                <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActive
                        ? "bg-accent text-accent-brand"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                </Button>
            )}
        </NavLink>
    )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
    const getColor = () => {
        switch (color) {
            case "cyan":
                return "from-cyan-500 to-blue-500"
            case "green":
                return "from-green-500 to-emerald-500"
            case "blue":
                return "from-blue-500 to-indigo-500"
            case "purple":
                return "from-purple-500 to-pink-500"
            default:
                return "from-cyan-500 to-blue-500"
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{value}%</div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    )
}


function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {

    const { userLogged } = useAuth();
    const userRole = userLogged?.role || null;
    if (!userRole) <Navigate to={'/'} />

    const [systemStatus, setSystemStatus] = useState(85)
    const [networkStatus, setNetworkStatus] = useState(92)
    const [securityLevel, setSecurityLevel] = useState(75)

    const menuItems = menuDashboard.filter(item => item.roles.includes(userRole));


    return (
        <div>
            <Card className="bg-card text-card-foreground border border-border transition-colors h-full md:h-screen overflow-y-auto">
                <CardContent className="p-4">
                    <nav className="space-y-2">
                        {
                            menuItems.map(item => (
                                <NavItem key={item.label} icon={item.icon} label={item.label} path={item.path} end={Boolean(item.end)} onNavigate={onNavigate} />

                            ))
                        }

                    </nav>

                    <div className="mt-8 pt-6 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-2 font-mono">SYSTEM STATUS</div>
                        <div className="space-y-3">
                            <StatusItem label="Core Systems" value={systemStatus} color="cyan" />
                            <StatusItem label="Security" value={securityLevel} color="green" />
                            <StatusItem label="Network" value={networkStatus} color="blue" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default React.memo(DashboardSidebar);
