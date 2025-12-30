import React, { useEffect, useState, useRef } from "react"
import {
    CircleOff, Download, Lock,
    type LucideIcon, Radio,
    RefreshCw, Shield, Terminal, Zap
} from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Slider } from "../../components/ui/slider"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { formatDate, formatTime } from "../../../shared/utils/helpers"
import { Outlet } from "react-router-dom";
import DashboardHeader from "../../Buses/components/DashboardHeader"
import DashBoardLoader from "../../Buses/components/DashboardLoader"
import DashboardSidebar from "../../Buses/components/DashboardSidebar"
import ActionButton from "../../Buses/components/AcctionButton"





function DashBoardLayout() {
    const [theme, setTheme] = useState<"dark" | "light">("dark")

    const [currentTime, setCurrentTime] = useState(new Date())
    const [isLoading, setIsLoading] = useState(true)

    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    // Update time
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Particle effect
    useEffect(() => {
        const canvas = canvasRef.current!
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const particles: Particle[] = []
        const particleCount = 100

        class Particle {
            x: number
            y: number
            size: number
            speedX: number
            speedY: number
            color: string

            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 3 + 1
                this.speedX = (Math.random() - 0.5) * 0.5
                this.speedY = (Math.random() - 0.5) * 0.5
                this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                if (this.x > canvas.width) this.x = 0
                if (this.x < 0) this.x = canvas.width
                if (this.y > canvas.height) this.y = 0
                if (this.y < 0) this.y = canvas.height
            }

            draw() {
                if (!ctx) return
                ctx.fillStyle = this.color
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

        function animate() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (const particle of particles) {
                particle.update()
                particle.draw()
            }

            requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            if (!canvas) return
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <div className={`${theme} mx-auto min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`} >

            {/* Background particle effect */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

            {/* Loading overlay */}
            {isLoading && <DashBoardLoader />}

            <div className="mx-2 p-4 relative z-10">
                {/* Header */}
                <DashboardHeader />

                {/* Main content */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <DashboardSidebar />

                    <div className="col-span-12 md:col-span-9 lg:col-span-8">
                        <Outlet />
                    </div>


                    {/* Right sidebar */}
                    <div className="col-span-12 lg:col-span-2">
                        <div className="grid gap-6">
                            {/* System time */}
                            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                                        <div className="text-center">
                                            <div className="text-xs text-slate-500 mb-1 font-mono">Hora del sistema</div>
                                            <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                                            <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                                                <div className="text-xs text-slate-500 mb-1">Uptime</div>
                                                <div className="text-sm font-mono text-slate-200">14d 06:42:18</div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                                                <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                                                <div className="text-sm font-mono text-slate-200">UTC-08:00</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick actions */}
                            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-slate-100 text-base">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3">
                                        <ActionButton icon={Shield} label="Security Scan" />
                                        <ActionButton icon={RefreshCw} label="Sync Data" />
                                        <ActionButton icon={Download} label="Backup" />
                                        <ActionButton icon={Terminal} label="Console" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Resource allocation */}
                            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-slate-100 text-base">Resource Allocation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-sm text-slate-400">Processing Power</div>
                                                <div className="text-xs text-cyan-400">42% allocated</div>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                                    style={{ width: "42%" }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-sm text-slate-400">Memory Allocation</div>
                                                <div className="text-xs text-purple-400">68% allocated</div>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                    style={{ width: "68%" }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-sm text-slate-400">Network Bandwidth</div>
                                                <div className="text-xs text-blue-400">35% allocated</div>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                    style={{ width: "35%" }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-700/50">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="text-slate-400">Priority Level</div>
                                                <div className="flex items-center">
                                                    <Slider defaultValue={[3]} max={5} step={1} className="w-24 mr-2" />
                                                    <span className="text-cyan-400">3/5</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Environment controls */}
                            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-slate-100 text-base">Environment Controls</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Radio className="text-cyan-500 mr-2 h-4 w-4" />
                                                <Label className="text-sm text-slate-400">Power Management</Label>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Lock className="text-cyan-500 mr-2 h-4 w-4" />
                                                <Label className="text-sm text-slate-400">Security Protocol</Label>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Zap className="text-cyan-500 mr-2 h-4 w-4" />
                                                <Label className="text-sm text-slate-400">Power Saving Mode</Label>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <CircleOff className="text-cyan-500 mr-2 h-4 w-4" />
                                                <Label className="text-sm text-slate-400">Auto Shutdown</Label>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}


export default React.memo(DashBoardLayout);
