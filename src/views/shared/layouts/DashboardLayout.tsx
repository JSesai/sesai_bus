import React from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../../Buses/components/DashboardHeader";
import DashBoardLoader from "../../Buses/components/Loader";
import DashboardSidebar from "../../Buses/components/DashboardSidebar";
import { useDashboard } from "../../auth/context/DashBoardContext";
import DashboardSidebarRigth from "../../Buses/components/DashboardSidebarRigth";

function DashBoardLayout() {

    const { isLoading, theme, backgrounDynamic, sidebarOpen, setSidebarOpen } = useDashboard();

    return (
        <div className={`${theme} mx-auto h-screen overflow-hidden text-slate-900 dark:text-slate-100`}>
            {isLoading && <DashBoardLoader />}

            {/* Mobile sidebar drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-72 bg-background overflow-y-auto p-4 border-r border-border">
                        <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <div className="mx-2 p-4 h-full overflow-y-auto">
                <DashboardHeader />

                <div className="grid grid-cols-12 gap-6">
                    {/* Desktop sidebar */}
                    <div className="hidden md:block md:col-span-3 lg:col-span-2">
                        <DashboardSidebar />
                    </div>

                    <div className="col-span-12 md:col-span-9 lg:col-span-8">
                        <Outlet />
                    </div>

                    {/* Right sidebar - hidden on mobile */}
                    <div className="hidden lg:block lg:col-span-2">
                        <DashboardSidebarRigth backgrounDynamic={backgrounDynamic} />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default React.memo(DashBoardLayout);
