import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../../Buses/components/DashboardHeader";
import DashBoardLoader from "../../Buses/components/Loader";
import DashboardSidebar from "../../Buses/components/DashboardSidebar";
import { useDashboard } from "../../auth/context/DashBoardContext";
import DashboardSidebarRigth from "../../Buses/components/DashboardSidebarRigth";





function DashBoardLayout() {

    const { isLoading, theme, backgrounDynamic } = useDashboard();

    const canvasRef = useRef<HTMLCanvasElement>(null)

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
    }, []);


    return (
        <div className={`${theme} ${theme === 'light' ? 'mx-auto min-h-screen from-white to-slate-100  text-slate-900 relative overflow-hidden' : 'mx-auto min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden'}`}>

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
                    <DashboardSidebarRigth backgrounDynamic={backgrounDynamic} />



                </div>
            </div>
        </div>
    )
}


export default React.memo(DashBoardLayout);
