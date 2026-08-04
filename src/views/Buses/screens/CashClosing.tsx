import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Calculator, Lock, Unlock, History, RefreshCw, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { useDashboard } from "../../auth/context/DashBoardContext";
import { useAuth } from "../../auth/context/AuthContext";
import { CashSummaryCard } from "../components/CashSummaryCard";
import { CashTransactionTable } from "../components/CashTransactionTable";
import showAlert from "../../Modals/Modals";

export default function CashClosing() {
    const { agency, activeCashClosing, refreshActiveCashClosing } = useDashboard();
    const { userLogged } = useAuth();

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [summary, setSummary] = useState<any>(null);
    const [transactions, setTransactions] = useState<ICashTransaction[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [notes, setNotes] = useState("");

    const agencyId = agency?.id || 0;
    const activeClosing = activeCashClosing;

    const loadSummary = useCallback(async () => {
        if (!agencyId) return;
        setIsLoading(true);
        try {
            const [summaryResp, transactionsResp] = await Promise.all([
                window.electron.cashClosing.getCashClosingSummary(agencyId, selectedDate),
                window.electron.cashClosing.getCashClosingTransactions(agencyId, selectedDate),
            ]);
            if (summaryResp.ok) setSummary(summaryResp.data);
            if (transactionsResp.ok) setTransactions(transactionsResp.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [agencyId, selectedDate]);

    const loadHistory = useCallback(async () => {
        if (!agencyId) return;
        try {
            const resp = await window.electron.cashClosing.getCashClosingHistory(agencyId);
            if (resp.ok) setHistory(resp.data);
        } catch (e) {
            console.error(e);
        }
    }, [agencyId]);

    useEffect(() => {
        refreshActiveCashClosing();
        loadSummary();
    }, [selectedDate]);

    const handleOpenCashClosing = async () => {
        if (!userLogged?.id || !agencyId) return;
        try {
            const resp = await window.electron.cashClosing.openCashClosing(userLogged.id, agencyId);
            if (resp.ok) {
                await refreshActiveCashClosing();
                showAlert({
                    typeAlert: 'success',
                    title: 'Corte de caja abierto',
                    message: 'Se ha abierto el corte de caja para hoy.',
                    btnAccept: 'Aceptar',
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCloseCashClosing = async () => {
        if (!activeClosing) return;

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        let total = 0;
        try {
            const resp = await window.electron.cashClosing.getCashClosingPeriodSummary(agencyId, activeClosing.closing_date, todayStr);
            if (resp.ok) total = resp.data?.totalSales || 0;
        } catch (e) {
            console.error(e);
        }

        showAlert({
            typeAlert: 'confirm',
            title: 'Cerrar corte de caja',
            message: `¿Estás seguro de cerrar el corte? Total del período: $${total.toFixed(2)}`,
            btnAccept: 'Cerrar corte',
            btnCancel: 'Cancelar',
            callbackAcept: async () => {
                try {
                    const resp = await window.electron.cashClosing.closeCashClosing(activeClosing.id, notes);
                    if (resp.ok) {
                        await refreshActiveCashClosing();
                        showAlert({
                            typeAlert: 'success',
                            title: 'Corte cerrado',
                            message: 'El corte de caja se ha cerrado exitosamente.',
                            btnAccept: 'Aceptar',
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            },
        });
    };

    const handleShowHistory = async () => {
        await loadHistory();
        setShowHistory(true);
    };

    const totalSales = summary?.totalSales || 0;
    const totalReservations = summary?.totalReservations || 0;
    const totalCancellations = summary?.totalCancellations || 0;
    const transactionCount = summary?.transactionCount || 0;

    const cashAmount = summary?.byMethod?.find((m: any) => m.method === 'cash')?.total_amount || 0;
    const cashCount = summary?.byMethod?.find((m: any) => m.method === 'cash')?.purchase_count || 0;
    const cardAmount = summary?.byMethod?.find((m: any) => m.method === 'card')?.total_amount || 0;
    const cardCount = summary?.byMethod?.find((m: any) => m.method === 'card')?.purchase_count || 0;
    const transferAmount = summary?.byMethod?.find((m: any) => m.method === 'transfer')?.total_amount || 0;
    const transferCount = summary?.byMethod?.find((m: any) => m.method === 'transfer')?.purchase_count || 0;

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Corte de Caja</h1>
                            <p className="text-sm text-muted-foreground">
                                Ventas registradas el {format(new Date(selectedDate + 'T00:00:00'), "d 'de' MMMM, yyyy", { locale: es })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-[180px]"
                            />
                        </div>
                        <Button variant="outline" size="sm" onClick={loadSummary} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShowHistory}>
                            <History className="w-4 h-4 mr-2" />
                            Historial
                        </Button>
                    </div>
                </div>

                {/* Status del corte */}
                {activeClosing ? (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Unlock className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-medium text-foreground">Corte abierto</p>
                                <p className="text-sm text-muted-foreground">
                                    Abierto a las {activeClosing.opening_time} — {format(new Date(activeClosing.closing_date + 'T00:00:00'), "d 'de' MMMM", { locale: es })}
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleCloseCashClosing} variant="destructive" size="sm">
                            <Lock className="w-4 h-4 mr-2" />
                            Cerrar Corte
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border border-muted p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium text-foreground">Sin corte abierto</p>
                                <p className="text-sm text-muted-foreground">
                                    Abre un corte de caja para comenzar a registrar ventas del día
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleOpenCashClosing} size="sm">
                            <Unlock className="w-4 h-4 mr-2" />
                            Abrir Corte
                        </Button>
                    </div>
                )}

                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel izquierdo: Resumen */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Ventas del Día
                        </h2>

                        <div className="grid grid-cols-1 gap-3">
                            <CashSummaryCard method="cash" amount={cashAmount} count={cashCount} />
                            <CashSummaryCard method="card" amount={cardAmount} count={cardCount} />
                            <CashSummaryCard method="transfer" amount={transferAmount} count={transferCount} />
                            <CashSummaryCard method="total" amount={totalSales} count={transactionCount} />
                        </div>

                        {/* Stats adicionales */}
                        <div className="rounded-xl border bg-card p-4 space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">Detalle</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Reservaciones</span>
                                    <span className="font-medium">${Number(totalReservations) || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cancelaciones</span>
                                    <span className="font-medium text-red-600">${Number(totalCancellations) || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Servicios</span>
                                    <span className="font-medium">${Number(summary?.totalServiceFees) || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm border-t pt-2">
                                    <span className="text-muted-foreground">Transacciones</span>
                                    <span className="font-medium">{transactionCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Notas */}
                        {activeClosing && (
                            <div className="rounded-xl border bg-card p-4 space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Notas del corte</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Observaciones adicionales..."
                                    className="w-full h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        )}
                    </div>

                    {/* Panel derecho: Transacciones */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            Transacciones ({transactions.length})
                        </h2>
                        <CashTransactionTable transactions={transactions} />
                    </div>
                </div>
            </main>

            {/* Dialog de historial */}
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogTitle>Historial de Cortes</DialogTitle>
                    {history.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No hay cortes cerrados</p>
                    ) : (
                        <div className="space-y-3">
                            {history.map((h) => (
                                <div key={h.id} className="rounded-lg border bg-card p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {format(new Date(h.closing_date + 'T00:00:00'), "d 'de' MMMM, yyyy", { locale: es })}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {h.opening_time} — {h.closing_time} • {h.user_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-foreground">${Number(h.total_sales) || 0}</p>
                                            <p className="text-xs text-muted-foreground">{h.transaction_count} transacciones</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                        <span>Efectivo: ${Number(h.total_cash) || 0}</span>
                                        <span>Tarjeta: ${Number(h.total_card) || 0}</span>
                                        <span>Transferencia: ${Number(h.total_transfer) || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
