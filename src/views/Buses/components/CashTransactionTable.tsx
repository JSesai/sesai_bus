import { Fragment, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Banknote, ChevronDown, ChevronRight, CreditCard, Landmark, Users } from "lucide-react";
import type { ICashTransaction } from "../../../types";
import { formatDayMonth } from "../../../shared/utils/helpers";

interface CashTransactionTableProps {
    transactions: ICashTransaction[];
}

const methodConfig = {
    cash: { label: "Efectivo", icon: Banknote, className: "bg-green-500/10 text-green-600" },
    card: { label: "Tarjeta", icon: CreditCard, className: "bg-blue-500/10 text-blue-600" },
    transfer: { label: "Transferencia", icon: Landmark, className: "bg-purple-500/10 text-purple-600" },
};

interface GroupedTx {
    key: string;
    origin: string;
    destination: string;
    date_departure: string;
    departure_time: string;
    transactions: ICashTransaction[];
    total: number;
    seats: number;
}

const groupKey = (tx: ICashTransaction): string =>
    `${tx.date_departure}|${tx.departure_time}|${tx.origin}|${tx.destination}`;

const methodTotals = (transactions: ICashTransaction[]): Record<string, number> => {
    const totals: Record<string, number> = {};
    for (const tx of transactions) {
        const method = tx.method || 'cash';
        totals[method] = (totals[method] || 0) + (Number(tx.amount) || 0);
    }
    return totals;
};

export function CashTransactionTable({ transactions }: CashTransactionTableProps) {
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set());

    const groups = useMemo<GroupedTx[]>(() => {
        const map = new Map<string, GroupedTx>();
        for (const tx of transactions) {
            const key = groupKey(tx);
            if (!map.has(key)) {
                map.set(key, {
                    key,
                    origin: tx.origin,
                    destination: tx.destination,
                    date_departure: tx.date_departure,
                    departure_time: tx.departure_time,
                    transactions: [],
                    total: 0,
                    seats: 0,
                });
            }
            const group = map.get(key)!;
            group.transactions.push(tx);
            group.total += Number(tx.amount) || 0;
            group.seats += Number(tx.ticket_count) || 0;
        }
        return [...map.values()];
    }, [transactions]);

    const toggleGroup = (key: string) => {
        setExpandedKeys(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    if (transactions.length === 0) {
        return (
            <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">No hay transacciones en esta fecha</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableBody>
                    {groups.map((group) => {
                        const isExpanded = expandedKeys.has(group.key);
                        const totals = methodTotals(group.transactions);

                        return (
                            <Fragment key={group.key}>
                                <TableRow
                                    onClick={() => toggleGroup(group.key)}
                                    className="cursor-pointer border-b hover:bg-muted/40"
                                    aria-expanded={isExpanded}
                                >
                                    <TableCell colSpan={6} className="p-0">
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            )}

                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold text-foreground truncate">
                                                    {group.origin} <span className="text-muted-foreground">→</span> {group.destination}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDayMonth(group.date_departure)} · Salida {group.departure_time}
                                                </div>
                                            </div>

                                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                {group.seats} boleto{group.seats !== 1 ? 's' : ''}
                                            </div>

                                            <div className="text-right">
                                                <div className="font-semibold text-foreground">
                                                    ${group.total.toFixed(2)}
                                                </div>
                                                <div className="flex flex-wrap justify-end gap-1">
                                                    {Object.entries(totals).map(([method, amount]) => {
                                                        const info = methodConfig[method as keyof typeof methodConfig] || methodConfig.cash;
                                                        const Icon = info.icon;
                                                        return (
                                                            <span
                                                                key={method}
                                                                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${info.className}`}
                                                            >
                                                                <Icon className="h-3 w-3" />
                                                                ${amount.toFixed(2)}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {isExpanded && (
                                    <TableRow className="bg-muted/20 border-b hover:bg-muted/20">
                                        <TableCell colSpan={6} className="p-0">
                                            <div className="px-4 py-3 sm:px-8">
                                                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Ventas ({group.transactions.length})
                                                </div>
                                                <div className="overflow-hidden rounded-lg border bg-card">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-[200px]">Cliente</TableHead>
                                                                <TableHead>Asientos</TableHead>
                                                                <TableHead className="text-right">Monto</TableHead>
                                                                <TableHead className="text-center">Método</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {group.transactions.map((tx) => {
                                                                const methodInfo = methodConfig[tx.method as keyof typeof methodConfig] || methodConfig.cash;
                                                                const Icon = methodInfo.icon;

                                                                return (
                                                                    <TableRow key={tx.id}>
                                                                        <TableCell className="font-medium whitespace-normal">
                                                                            <div className="truncate max-w-[180px]">{tx.customer_name}</div>
                                                                            <div className="text-xs text-muted-foreground">{tx.customer_phone}</div>
                                                                        </TableCell>
                                                                        <TableCell className="whitespace-normal">
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {tx.seat_numbers?.split(',').map((seat) => (
                                                                                    <span
                                                                                        key={seat}
                                                                                        className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground"
                                                                                    >
                                                                                        {seat.trim()}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-right font-medium">
                                                                            ${Number(tx.amount) || 0}
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Badge variant="secondary" className={methodInfo.className}>
                                                                                <Icon className="w-3 h-3 mr-1" />
                                                                                {methodInfo.label}
                                                                            </Badge>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
