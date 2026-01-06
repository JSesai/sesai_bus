
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { type LucideIcon } from "lucide-react";


interface itemMenu {
    title: string;
    description: string;
    icon: LucideIcon;
    path: string;
    color: string;
    bgColor: string;
    hoverColor: string;
}

interface arrayMenu {
    menu: itemMenu[];
    titleMenu: string;
    description: string;
}


export function MenuCard({ menu, titleMenu, description }: arrayMenu) {

    return (
        <div className=" border-slate-700/50 backdrop-blur-sm overflow-hidden p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-balance mb-2">{titleMenu}</h1>
                <p className="text-muted-foreground text-pretty">{description}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 flex items-center justify-center">
                {menu.map((item) => {
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