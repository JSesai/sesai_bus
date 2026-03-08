import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import { Label } from "../../components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover"
import type { DateRange } from "react-day-picker"
import { es } from "date-fns/locale";


interface Props {
    labelCalendar?: string;
    mode?: "single" | "range";
    value: Date | DateRange | undefined;
    onChange?: (val: Date | DateRange | undefined) => void;
}

export function CalendarCustom({ labelCalendar = "Fecha", mode = "single", value, onChange }: Props) {
    const [open, setOpen] = React.useState(false)

    // función para mostrar el texto en el botón
    const formatLabel = () => {
        if (mode === "single") {
            return value instanceof Date ? value.toLocaleDateString() : "Selecciona fecha";
        } else {
            const range = value as DateRange | undefined;
            if (!range?.from) return "Selecciona rango de fechas"
            const from = range.from.toLocaleDateString();
            const to = range.to ? range.to.toLocaleDateString() : "...";
            return `${from} - ${to}`
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {labelCalendar}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-64 justify-between font-normal"
                    >
                        {formatLabel()}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    {mode === "single" ? (
                        <Calendar
                            mode="single"
                            selected={value as Date | undefined}
                            captionLayout="dropdown"
                            onSelect={(selectedDate) => {
                                onChange?.(selectedDate);
                                setOpen(false);
                            }}
                            locale={es}
                        />
                    ) : (
                        <Calendar
                            mode="range"
                            selected={value as DateRange | undefined}
                            captionLayout="dropdown"
                            onSelect={(selected) => {
                                onChange?.(selected);
                                setOpen(true);
                            }}
                            locale={es}
                        />
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}
