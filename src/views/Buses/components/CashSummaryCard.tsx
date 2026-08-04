import { Banknote, CreditCard, Landmark, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

interface CashSummaryCardProps {
    method: 'cash' | 'card' | 'transfer' | 'total';
    amount: number;
    count: number;
    className?: string;
}

const config = {
    cash: {
        label: "Efectivo",
        icon: Banknote,
        bgClass: "bg-green-500/10",
        iconClass: "text-green-600",
        borderClass: "border-green-500/20",
    },
    card: {
        label: "Tarjeta",
        icon: CreditCard,
        bgClass: "bg-blue-500/10",
        iconClass: "text-blue-600",
        borderClass: "border-blue-500/20",
    },
    transfer: {
        label: "Transferencia",
        icon: Landmark,
        bgClass: "bg-purple-500/10",
        iconClass: "text-purple-600",
        borderClass: "border-purple-500/20",
    },
    total: {
        label: "Total General",
        icon: TrendingUp,
        bgClass: "bg-primary/10",
        iconClass: "text-primary",
        borderClass: "border-primary/20",
    },
};

export function CashSummaryCard({ method, amount, count, className }: CashSummaryCardProps) {
    const c = config[method];
    const Icon = c.icon;

    return (
        <div className={cn(
            "rounded-xl border p-4 space-y-3",
            c.borderClass,
            c.bgClass,
            className
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={cn("w-5 h-5", c.iconClass)} />
                    <span className="text-sm font-medium text-foreground">{c.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{count} venta{count !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
                ${Number(amount) || 0}
            </div>
        </div>
    );
}
