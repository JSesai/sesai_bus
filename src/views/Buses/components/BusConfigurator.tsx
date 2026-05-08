"use client"

import { Label } from "../../components/ui/label"
import { Slider } from "../../components/ui/slider"
import { Settings2 } from "lucide-react"

interface BusConfiguratorProps {
    totalSeats: number
    seatsPerRow: number
    occupancyRate: number
    onTotalSeatsChange: (value: number) => void
    onSeatsPerRowChange: (value: number) => void
    onOccupancyRateChange: (value: number) => void
}

export function BusConfigurator({
    totalSeats,
    seatsPerRow,
    occupancyRate,
    onTotalSeatsChange,
    onSeatsPerRowChange,
    onOccupancyRateChange,
}: BusConfiguratorProps) {
    return (
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <div className="flex items-center gap-2 text-foreground">
                <Settings2 className="w-5 h-5" />
                <h3 className="font-semibold">Configuración del Autobús</h3>
            </div>

            <div className="space-y-5">
                {/* Total seats */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm text-foreground">Total de Asientos</Label>
                        <span className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                            {totalSeats}
                        </span>
                    </div>
                    <Slider
                        value={[totalSeats]}
                        onValueChange={(value) => onTotalSeatsChange(value[0])}
                        min={8}
                        max={60}
                        step={seatsPerRow}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>8</span>
                        <span>60</span>
                    </div>
                </div>

                {/* Seats per row */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm text-foreground">Asientos por Fila</Label>
                        <span className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                            {seatsPerRow}
                        </span>
                    </div>
                    <Slider
                        value={[seatsPerRow]}
                        onValueChange={(value) => onSeatsPerRowChange(value[0])}
                        min={2}
                        max={6}
                        step={2}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>2 (Mini)</span>
                        <span>6 (Grande)</span>
                    </div>
                </div>

                {/* Occupancy rate simulation */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm text-foreground">Ocupación (simulado)</Label>
                        <span className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                            {occupancyRate}%
                        </span>
                    </div>
                    <Slider
                        value={[occupancyRate]}
                        onValueChange={(value) => onOccupancyRateChange(value[0])}
                        min={0}
                        max={80}
                        step={5}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>80%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
