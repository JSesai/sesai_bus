import { useState } from "react"
import {
    Activity, BarChart3, Cpu, HardDrive, LineChart, type LucideIcon, RefreshCw, Wifi
} from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"


// Component for metric cards
export function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    color,
    detail,
}: {
    title: string
    value: number
    icon: LucideIcon
    trend: "up" | "down" | "stable"
    color: string
    detail: string
}) {
    const getColor = () => {
        switch (color) {
            case "cyan":
                return "from-cyan-500 to-blue-500 border-cyan-500/30"
            case "green":
                return "from-green-500 to-emerald-500 border-green-500/30"
            case "blue":
                return "from-blue-500 to-indigo-500 border-blue-500/30"
            case "purple":
                return "from-purple-500 to-pink-500 border-purple-500/30"
            default:
                return "from-cyan-500 to-blue-500 border-cyan-500/30"
        }
    }

    const getTrendIcon = () => {
        switch (trend) {
            case "up":
                return <BarChart3 className="h-4 w-4 text-amber-500" />
            case "down":
                return <BarChart3 className="h-4 w-4 rotate-180 text-green-500" />
            case "stable":
                return <LineChart className="h-4 w-4 text-blue-500" />
            default:
                return null
        }
    }

    return (
        <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-400">{title}</div>
                <Icon className={`h-5 w-5 text-${color}-500`} />
            </div>
            <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
                {value}%
            </div>
            <div className="text-xs text-slate-500">{detail}</div>
            <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
            <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
        </div>
    )
}

// Performance chart component
export function PerformanceChart() {
    return (
        <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
            {/* Y-axis labels */}
            <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
                <div className="text-xs text-slate-500">100%</div>
                <div className="text-xs text-slate-500">75%</div>
                <div className="text-xs text-slate-500">50%</div>
                <div className="text-xs text-slate-500">25%</div>
                <div className="text-xs text-slate-500">0%</div>
            </div>

            {/* X-axis grid lines */}
            <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
                <div className="border-b border-slate-700/30 w-full"></div>
                <div className="border-b border-slate-700/30 w-full"></div>
                <div className="border-b border-slate-700/30 w-full"></div>
                <div className="border-b border-slate-700/30 w-full"></div>
                <div className="border-b border-slate-700/30 w-full"></div>
            </div>

            {/* Chart bars */}
            <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
                {Array.from({ length: 24 }).map((_, i) => {
                    const cpuHeight = Math.floor(Math.random() * 60) + 20
                    const memHeight = Math.floor(Math.random() * 40) + 40
                    const netHeight = Math.floor(Math.random() * 30) + 30

                    return (
                        <div key={i} className="flex space-x-0.5">
                            <div
                                className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm"
                                style={{ height: `${cpuHeight}%` }}
                            ></div>
                            <div
                                className="w-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
                                style={{ height: `${memHeight}%` }}
                            ></div>
                            <div
                                className="w-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                                style={{ height: `${netHeight}%` }}
                            ></div>
                        </div>
                    )
                })}
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
                <div className="text-xs text-slate-500">00:00</div>
                <div className="text-xs text-slate-500">06:00</div>
                <div className="text-xs text-slate-500">12:00</div>
                <div className="text-xs text-slate-500">18:00</div>
                <div className="text-xs text-slate-500">24:00</div>
            </div>
        </div>
    )
}


// Process row component
export function ProcessRow({
    pid,
    name,
    user,
    cpu,
    memory,
    status,
}: {
    pid: string
    name: string
    user: string
    cpu: number
    memory: number
    status: string
}) {
    return (
        <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
            <div className="col-span-1 text-slate-500">{pid}</div>
            <div className="col-span-4 text-slate-300">{name}</div>
            <div className="col-span-2 text-slate-400">{user}</div>
            <div className="col-span-2 text-cyan-400">{cpu}%</div>
            <div className="col-span-2 text-purple-400">{memory} MB</div>
            <div className="col-span-1">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                    {status}
                </Badge>
            </div>
        </div>
    )
}

// Storage item component
export function StorageItem({
    name,
    total,
    used,
    type,
}: {
    name: string
    total: number
    used: number
    type: string
}) {
    const percentage = Math.round((used / total) * 100)

    return (
        <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-300">{name}</div>
                <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs">
                    {type}
                </Badge>
            </div>
            <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-slate-500">
                        {used} GB / {total} GB
                    </div>
                    <div className="text-xs text-slate-400">{percentage}%</div>
                </div>
                <Progress value={percentage} className="h-1.5 bg-slate-700">
                    <div
                        className={`h-full rounded-full ${percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-amber-500" : "bg-cyan-500"
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </Progress>
            </div>
            <div className="flex items-center justify-between text-xs">
                <div className="text-slate-500">Free: {total - used} GB</div>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-slate-400 hover:text-slate-100">
                    Details
                </Button>
            </div>
        </div>
    )
}


export default function SystemOverview() {

    const [cpuUsage, setCpuUsage] = useState(42)
    const [networkStatus, setNetworkStatus] = useState(92)
    const [securityLevel, setSecurityLevel] = useState(75)
    const [memoryUsage, setMemoryUsage] = useState(68)


    return (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-700/50 pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                        Informacion del sistema
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                            LIVE
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                        title="CPU Usage"
                        value={cpuUsage}
                        icon={Cpu}
                        trend="up"
                        color="cyan"
                        detail="3.8 GHz | 12 Cores"
                    />
                    <MetricCard
                        title="Memory"
                        value={memoryUsage}
                        icon={HardDrive}
                        trend="stable"
                        color="purple"
                        detail="16.4 GB / 24 GB"
                    />
                    <MetricCard
                        title="Network"
                        value={networkStatus}
                        icon={Wifi}
                        trend="down"
                        color="blue"
                        detail="1.2 GB/s | 42ms"
                    />
                </div>

                <div className="mt-8">
                    <Tabs defaultValue="performance" className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-slate-800/50 p-1">
                                <TabsTrigger
                                    value="performance"
                                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                                >
                                    Performance
                                </TabsTrigger>
                                <TabsTrigger
                                    value="processes"
                                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                                >
                                    Processes
                                </TabsTrigger>
                                <TabsTrigger
                                    value="storage"
                                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                                >
                                    Storage
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                                    CPU
                                </div>
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                                    Memory
                                </div>
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                                    Network
                                </div>
                            </div>
                        </div>

                        <TabsContent value="performance" className="mt-0">
                            <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                                <PerformanceChart />
                                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                                    <div className="text-xs text-slate-400">System Load</div>
                                    <div className="text-lg font-mono text-cyan-400">{cpuUsage}%</div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="processes" className="mt-0">
                            <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                                <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                                    <div className="col-span-1">PID</div>
                                    <div className="col-span-4">Process</div>
                                    <div className="col-span-2">User</div>
                                    <div className="col-span-2">CPU</div>
                                    <div className="col-span-2">Memory</div>
                                    <div className="col-span-1">Status</div>
                                </div>

                                <div className="divide-y divide-slate-700/30">
                                    <ProcessRow
                                        pid="1024"
                                        name="system_core.exe"
                                        user="SYSTEM"
                                        cpu={12.4}
                                        memory={345}
                                        status="running"
                                    />
                                    <ProcessRow
                                        pid="1842"
                                        name="nexus_service.exe"
                                        user="SYSTEM"
                                        cpu={8.7}
                                        memory={128}
                                        status="running"
                                    />
                                    <ProcessRow
                                        pid="2156"
                                        name="security_monitor.exe"
                                        user="ADMIN"
                                        cpu={5.2}
                                        memory={96}
                                        status="running"
                                    />
                                    <ProcessRow
                                        pid="3012"
                                        name="network_manager.exe"
                                        user="SYSTEM"
                                        cpu={3.8}
                                        memory={84}
                                        status="running"
                                    />
                                    <ProcessRow
                                        pid="4268"
                                        name="user_interface.exe"
                                        user="USER"
                                        cpu={15.3}
                                        memory={256}
                                        status="running"
                                    />
                                    <ProcessRow
                                        pid="5124"
                                        name="data_analyzer.exe"
                                        user="ADMIN"
                                        cpu={22.1}
                                        memory={512}
                                        status="running"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="storage" className="mt-0">
                            <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <StorageItem name="System Drive (C:)" total={512} used={324} type="SSD" />
                                    <StorageItem name="Data Drive (D:)" total={2048} used={1285} type="HDD" />
                                    <StorageItem name="Backup Drive (E:)" total={4096} used={1865} type="HDD" />
                                    <StorageItem name="External Drive (F:)" total={1024} used={210} type="SSD" />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
} 