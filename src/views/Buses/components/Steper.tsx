import { cn } from "../../lib/utils"
import { Check, type LucideIcon } from "lucide-react"

export interface Step {
    id: number
    label: string
    icon: LucideIcon
    description?: string;
    disabled?: boolean;
}

interface StepperProps {
    steps: Step[]
    currentStep: number
    className?: string
}

export default function Stepper({ steps, currentStep, className }: StepperProps) {

    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id
                    const isCurrent = currentStep === step.id
                    const isLast = index === steps.length - 1
                    const Icon = step.icon

                    return (
                        step.disabled ? null :
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center",
                                    !isLast && "flex-1"
                                )}
                            >
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                                            isCompleted && "border-primary bg-primary text-primary-foreground",
                                            isCurrent && "border-primary bg-primary/10 text-primary ring-4 ring-primary/20",
                                            !isCompleted && !isCurrent && "border-muted-foreground/30 bg-muted text-muted-foreground "
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5" />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}

                                        {/* Animación para el paso actual */}
                                        {isCurrent && (
                                            <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                                        )}
                                    </div>

                                    {/* Label & Description */}
                                    <div className="mt-2 text-center">
                                        <p
                                            className={cn(
                                                "text-sm font-medium transition-colors",
                                                isCompleted && "text-primary",
                                                isCurrent && "text-primary",
                                                !isCompleted && !isCurrent && "text-muted-foreground"
                                            )}
                                        >
                                            {step.label}
                                        </p>
                                        {step.description && (
                                            <p className="mt-0.5 text-xs text-muted-foreground max-w-[100px]">
                                                {step.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {!isLast && (
                                    <div className="flex-1 mx-0.5 h-0.5 self-start mt-6">
                                        <div
                                            className={cn(
                                                "h-full w-full rounded-full transition-all duration-500",
                                                isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                    )
                })}
            </div>
        </div>
    )
}
