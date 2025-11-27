import { Outlet } from "react-router-dom";


export default function DashBoardLayout() {
    return (

        <div >

            <main>
                <Outlet /> {/* Aquí se renderizan las rutas hijas */}
            </main>
        </div>


    )
}