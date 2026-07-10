
import React from 'react';
import {
    CreditCard,
    User,
    Mail,
    Phone, CheckCircle2, Banknote,
    Coins,
    Receipt
} from "lucide-react"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"


interface PropsPayForm {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    paymentMethod: string;
    setPaymentMethod: (method: Payment['method']) => void;
    formData: {
        name: string;
        email: string;
        phone: string;
    };
    cashReceived: string;
    setCashReceived: (value: string) => void;
    handleCashReceivedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    quickCashAmounts: number[];
    finalTotal: number;
    change: number;
    canCompleteCashPayment: boolean;
    cashReceivedNumber: number;
}

export default function PayForm(props: PropsPayForm) {

    const {
        handleSubmit,
        handleInputChange,
        paymentMethod,
        setPaymentMethod,
        formData,
        cashReceived,
        setCashReceived,
        handleCashReceivedChange,
        quickCashAmounts,
        finalTotal,
        change,
        canCompleteCashPayment,
        cashReceivedNumber
    } = props;

    const formatCardNumber = (value: string) => {
        const numbers = value.replace(/\D/g, "")
        const groups = numbers.match(/.{1,4}/g)
        return groups ? groups.join(" ").substr(0, 19) : ""
    }

    const formatExpiry = (value: string) => {
        const numbers = value.replace(/\D/g, "")
        if (numbers.length >= 2) {
            return numbers.substr(0, 2) + "/" + numbers.substr(2, 2)
        }
        return numbers
    }





    return (
        <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">


                {/* Payment Method Selection */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-5">
                    <div className="flex items-center gap-2 text-foreground">
                        <Receipt className="w-5 h-5" />
                        <h2 className="font-semibold">Método de Pago</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === "card"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/50"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === "card" ? "bg-primary/10" : "bg-muted"
                                }`}>
                                <CreditCard className={`w-6 h-6 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"
                                    }`} />
                            </div>
                            <span className={`font-medium ${paymentMethod === "card" ? "text-primary" : "text-foreground"
                                }`}>
                                Tarjeta
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod("cash")}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === "cash"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/50"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === "cash" ? "bg-primary/10" : "bg-muted"
                                }`}>
                                <Banknote className={`w-6 h-6 ${paymentMethod === "cash" ? "text-primary" : "text-muted-foreground"
                                    }`} />
                            </div>
                            <span className={`font-medium ${paymentMethod === "cash" ? "text-primary" : "text-foreground"
                                }`}>
                                Efectivo
                            </span>
                        </button>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === "card" && (
                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Número de tarjeta</Label>
                                <div className="relative">
                                    <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="cardNumber"
                                        name="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={''}
                                        onChange={(e) => {
                                            e.target.value = formatCardNumber(e.target.value)
                                            handleInputChange(e)
                                        }}
                                        className="pl-10"
                                        maxLength={19}
                                        required={paymentMethod === "card"}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardExpiry">Fecha de expiración</Label>
                                    <Input
                                        id="cardExpiry"
                                        name="cardExpiry"
                                        placeholder="MM/YY"
                                        value={''}
                                        onChange={(e) => {
                                            e.target.value = formatExpiry(e.target.value)
                                            handleInputChange(e)
                                        }}
                                        maxLength={5}
                                        required={paymentMethod === "card"}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cardCvc">CVC</Label>
                                    <Input
                                        id="cardCvc"
                                        name="cardCvc"
                                        placeholder="123"
                                        value={''}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, "").substr(0, 4)
                                            handleInputChange(e)
                                        }}
                                        maxLength={4}
                                        required={paymentMethod === "card"}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Tu información de pago está protegida con encriptación SSL de 256 bits.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Cash Payment Form */}
                    {paymentMethod === "cash" && (
                        <div className="space-y-5 pt-4 border-t border-border">
                            {/* Total to pay highlight */}
                            <div className="bg-primary/5 rounded-xl p-4 text-center">
                                <p className="text-sm text-muted-foreground mb-1">Total a cobrar</p>
                                <p className="text-3xl font-bold text-primary">${finalTotal.toFixed(2)}</p>
                            </div>

                            {/* Cash received input */}
                            <div className="space-y-2">
                                <Label htmlFor="cashReceived">Efectivo recibido</Label>
                                <div className="relative">
                                    <Banknote className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="cashReceived"
                                        placeholder="0.00"
                                        value={cashReceived}
                                        onChange={handleCashReceivedChange}
                                        className="pl-10 text-lg font-semibold"
                                    />
                                </div>
                            </div>

                            {/* Quick amount buttons */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Montos rápidos</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {quickCashAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setCashReceived(amount.toString())}
                                            className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${parseFloat(cashReceived) === amount
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-muted-foreground/50 text-foreground"
                                                }`}
                                        >
                                            ${amount}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Change calculation */}
                            {cashReceived && (
                                <div className={`rounded-xl p-4 ${canCompleteCashPayment
                                    ? "bg-green-500/10 border border-green-500/20"
                                    : "bg-red-500/10 border border-red-500/20"
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Coins className={`w-5 h-5 ${canCompleteCashPayment ? "text-green-600" : "text-red-600"
                                                }`} />
                                            <span className={`font-medium ${canCompleteCashPayment ? "text-green-700" : "text-red-700"
                                                }`}>
                                                {canCompleteCashPayment ? "Cambio a entregar" : "Falta dinero"}
                                            </span>
                                        </div>
                                        <span className={`text-2xl font-bold ${canCompleteCashPayment ? "text-green-600" : "text-red-600"
                                            }`}>
                                            ${Math.abs(change).toFixed(2)}
                                        </span>
                                    </div>

                                    {canCompleteCashPayment && change > 0 && (
                                        <div className="mt-3 pt-3 border-t border-green-500/20">
                                            <p className="text-xs text-green-700">
                                                Recibido: ${cashReceivedNumber.toFixed(2)} - Total: ${finalTotal.toFixed(2)} = Cambio: ${change.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Passenger Info */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-5">
                    <div className="flex items-center gap-2 text-foreground">
                        <User className="w-5 h-5" />
                        <h2 className="font-semibold">Datos del Pasajero</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Juan Pérez García"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+52 55 1234 5678"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </form>
        </div>
    )
}
