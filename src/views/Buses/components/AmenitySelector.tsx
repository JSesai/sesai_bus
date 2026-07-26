import { useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Plus, X } from "lucide-react";

const DEFAULT_AMENITIES = [
    "WiFi",
    "Aire acondicionado",
    "Pantallas individuales",
    "Asientos reclinables",
    "Baño",
    "Tomas USB",
    "Cinturones de seguridad",
    "Sistema de entretenimiento",
    "Cortinas",
    "Aire acondicionado de cabina",
];

interface AmenitySelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function AmenitySelector({ value, onChange, disabled }: AmenitySelectorProps) {
    const [customInput, setCustomInput] = useState("");

    const selected: string[] = value
        ? value.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    const allAmenities = [
        ...DEFAULT_AMENITIES,
        ...selected.filter((s) => !DEFAULT_AMENITIES.includes(s)),
    ];

    const toggle = (amenity: string) => {
        if (disabled) return;
        const updated = selected.includes(amenity)
            ? selected.filter((a) => a !== amenity)
            : [...selected, amenity];
        onChange(updated.join(", "));
    };

    const addCustom = () => {
        const trimmed = customInput.trim();
        if (!trimmed || selected.includes(trimmed)) {
            setCustomInput("");
            return;
        }
        onChange([...selected, trimmed].join(", "));
        setCustomInput("");
    };

    const handleCustomKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCustom();
        }
    };

    const removeAmenity = (amenity: string) => {
        if (disabled) return;
        onChange(selected.filter((a) => a !== amenity).join(", "));
    };

    return (
        <div className="space-y-3">
            {/* Selected amenities as badges */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selected.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="gap-1 pr-1.5">
                            {amenity}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removeAmenity(amenity)}
                                    className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Checkbox grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allAmenities.map((amenity) => {
                    const isCustom = !DEFAULT_AMENITIES.includes(amenity);
                    const isChecked = selected.includes(amenity);
                    return (
                        <label
                            key={amenity}
                            className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm cursor-pointer transition-colors ${
                                isChecked
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/50"
                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggle(amenity)}
                                disabled={disabled}
                            />
                            <span className="flex-1 truncate">{amenity}</span>
                            {isCustom && (
                                <span className="text-[10px] text-muted-foreground">custom</span>
                            )}
                        </label>
                    );
                })}
            </div>

            {/* Add custom amenity */}
            {!disabled && (
                <div className="flex gap-2">
                    <Input
                        placeholder="Agregar amenidad personalizada..."
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={handleCustomKeyDown}
                        className="h-9"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCustom}
                        disabled={!customInput.trim()}
                        className="h-9 px-3 shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
