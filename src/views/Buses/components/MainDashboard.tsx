import { useState } from "react"
import {
    AlertCircle, Download, MessageSquare,
    Mic, Shield
} from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import SystemOverview from "./SystemOverview"


// Alert item component
function AlertItem({
    title,
    time,
    description,
    type,
}: {
    title: string
    time: string
    description: string
    type: "info" | "warning" | "error" | "success" | "update"
}) {
    const getTypeStyles = () => {
        switch (type) {
            case "info":
                return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
            case "warning":
                return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
            case "error":
                return { icon: AlertCircle, color: "text-red-500 bg-red-500/10 border-red-500/30" }
            case "success":
                return { icon: Check, color: "text-green-500 bg-green-500/10 border-green-500/30" }
            case "update":
                return { icon: Download, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
            default:
                return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
        }
    }

    const { icon: Icon, color } = getTypeStyles()

    return (
        <div className="flex items-start space-x-3">
            <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
                <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
            </div>
            <div>
                <div className="flex items-center">
                    <div className="text-sm font-medium text-slate-200">{title}</div>
                    <div className="ml-2 text-xs text-slate-500">{time}</div>
                </div>
                <div className="text-xs text-slate-400">{description}</div>
            </div>
        </div>
    )
}

// Communication item component
function CommunicationItem({
    sender,
    time,
    message,
    avatar,
    unread,
}: {
    sender: string
    time: string
    message: string
    avatar: string
    unread?: boolean
}) {
    return (
        <div className={`flex space-x-3 p-2 rounded-md ${unread ? "bg-slate-800/50 border border-slate-700/50" : ""}`}>
            <Avatar className="h-8 w-8">
                <AvatarImage src={avatar} alt={sender} />
                <AvatarFallback className="bg-slate-700 text-cyan-500">{sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-200">{sender}</div>
                    <div className="text-xs text-slate-500">{time}</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">{message}</div>
            </div>
            {unread && (
                <div className="flex-shrink-0 self-center">
                    <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                </div>
            )}
        </div>
    )
}

// Add missing imports
function Info(props: any) {
    return <AlertCircle {...props} />
}

function Check(props: any) {
    return <Shield {...props} />
}


export default function MainDashboard() {

    const [securityLevel, setSecurityLevel] = useState(75)

    return (

        <div className="grid gap-6">
            {/* System overview */}
            <SystemOverview />

            {/* Security & Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-100 flex items-center text-base">
                            <Shield className="mr-2 h-5 w-5 text-green-500" />
                            Security Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-400">Firewall</div>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-400">Intrusion Detection</div>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-400">Encryption</div>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-400">Threat Database</div>
                                <div className="text-sm text-cyan-400">
                                    Updated <span className="text-slate-500">12 min ago</span>
                                </div>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium">Security Level</div>
                                    <div className="text-sm text-cyan-400">{securityLevel}%</div>
                                </div>
                                <Progress value={securityLevel} className="h-2 bg-slate-700">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                                        style={{ width: `${securityLevel}%` }}
                                    />
                                </Progress>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-100 flex items-center text-base">
                            <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                            System Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <AlertItem
                                title="Security Scan Complete"
                                time="14:32:12"
                                description="No threats detected in system scan"
                                type="info"
                            />
                            <AlertItem
                                title="Bandwidth Spike Detected"
                                time="13:45:06"
                                description="Unusual network activity on port 443"
                                type="warning"
                            />
                            <AlertItem
                                title="System Update Available"
                                time="09:12:45"
                                description="Version 12.4.5 ready to install"
                                type="update"
                            />
                            <AlertItem
                                title="Backup Completed"
                                time="04:30:00"
                                description="Incremental backup to drive E: successful"
                                type="success"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Communications */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                        <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                        Communications Log
                    </CardTitle>
                    <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50">
                        4 New Messages
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <CommunicationItem
                            sender="System Administrator"
                            time="15:42:12"
                            message="Scheduled maintenance will occur at 02:00. All systems will be temporarily offline."
                            avatar="/placeholder.svg?height=40&width=40"
                            unread
                        />
                        <CommunicationItem
                            sender="Security Module"
                            time="14:30:45"
                            message="Unusual login attempt blocked from IP 192.168.1.45. Added to watchlist."
                            avatar="/placeholder.svg?height=40&width=40"
                            unread
                        />
                        <CommunicationItem
                            sender="Network Control"
                            time="12:15:33"
                            message="Bandwidth allocation adjusted for priority services during peak hours."
                            avatar="/placeholder.svg?height=40&width=40"
                            unread
                        />
                        <CommunicationItem
                            sender="Data Center"
                            time="09:05:18"
                            message="Backup verification complete. All data integrity checks passed."
                            avatar="/placeholder.svg?height=40&width=40"
                            unread
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-4">
                    <div className="flex items-center w-full space-x-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
                            <Mic className="h-4 w-4" />
                        </Button>
                        <Button size="icon" className="bg-cyan-600 hover:bg-cyan-700">
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

        </div>
    )
}