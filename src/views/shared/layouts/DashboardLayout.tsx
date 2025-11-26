import { Link, Outlet } from "react-router-dom";


export default function DashBoardLayout() {
    return (
        <div>
            <header>
                <h1>Dashboard Taquilla</h1>
                <nav>
                    <Link to="buses">Buses</Link>
                    <Link to="tickets">Tickets</Link>
                    <Link to="drivers">Choferes</Link>
                    <Link to="customers">Clientes</Link>
                </nav>
            </header>

            <main>
                <Outlet /> {/* Aquí se renderizan las rutas hijas */}
            </main>
        </div>


    )
}