import {
    CircleOff, Download, Lock, Radio,
    RefreshCw, Shield, Terminal, Zap
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Slider } from "../../components/ui/slider"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { formatDate, formatTime } from "../../../shared/utils/helpers"
import ActionButton from "../../Buses/components/AcctionButton"
import { useEffect, useState } from "react"
import { useDashboard } from "../../auth/context/DashBoardContext"

interface PropsDasboardRigth {
    backgrounDynamic: string;
}

export default function DashboardSidebarRigth({ backgrounDynamic }: PropsDasboardRigth) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { isLoading, theme, loadSystemInformation } = useDashboard();

    // Update time
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, []);


    return (
        <div className="col-span-12 lg:col-span-2">
            <div className="grid gap-6">
                {/* System time */}
                <Card className="bg-card text-card-foreground border border-border  transition-colors overflow-hidden">
                    <CardContent className="p-0">
                        <div className={`${backgrounDynamic}`}>
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-1 font-mono">Hora del sistema</div>
                                <div className="text-3xl font-mono text-accent-brand mb-1">{formatTime(currentTime)}</div>
                                <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/50 border border-border  transition-colors rounded-md p-3">
                                    <div className="text-xs text-muted-foreground mb-1">Uptime</div>
                                    <div className="text-sm font-mono text-foreground">14d 06:42:18</div>
                                </div>
                                <div className="bg-muted/50 border border-border  transition-colors rounded-md p-3">
                                    <div className="text-xs text-muted-foreground mb-1">Time Zone</div>
                                    <div className="text-sm font-mono text-foreground">UTC-08:00</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick actions */}
                <Card className="bg-card text-card-foreground border border-border  transition-colors duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <ActionButton icon={Shield} label="Security Scan" />
                            <ActionButton icon={RefreshCw} label="Recargar" onClick={loadSystemInformation} />
                            <ActionButton icon={Download} label="Backup" />
                            <ActionButton icon={Terminal} label="Console" />
                        </div>
                    </CardContent>
                </Card>

                {/* Resource allocation */}
                <Card className="bg-card text-card-foreground border border-border  transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Resource Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm text-muted-foreground">Processing Power</div>
                                    <div className="text-xs text-accent-brand">42% allocated</div>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                        style={{ width: "42%" }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm text-muted-foreground">Memory Allocation</div>
                                    <div className="text-xs text-purple-400">68% allocated</div>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        style={{ width: "68%" }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm text-muted-foreground">Network Bandwidth</div>
                                    <div className="text-xs text-blue-400">35% allocated</div>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                        style={{ width: "35%" }}
                                    ></div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="text-muted-foreground">Priority Level</div>
                                    <div className="flex items-center">
                                        <Slider defaultValue={[3]} max={5} step={1} className="w-24 mr-2" />
                                        <span className="text-accent-brand">3/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Environment controls */}
                <Card className="bg-card text-card-foreground border border-border  transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Environment Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Radio className="text-accent-brand mr-2 h-4 w-4" />
                                    <Label className="text-sm text-muted-foreground">Power Management</Label>
                                </div>
                                <Switch />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Lock className="text-accent-brand mr-2 h-4 w-4" />
                                    <Label className="text-sm text-muted-foreground">Security Protocol</Label>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Zap className="text-accent-brand mr-2 h-4 w-4" />
                                    <Label className="text-sm text-muted-foreground">Power Saving Mode</Label>
                                </div>
                                <Switch />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CircleOff className="text-accent-brand mr-2 h-4 w-4" />
                                    <Label className="text-sm text-muted-foreground">Auto Shutdown</Label>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
