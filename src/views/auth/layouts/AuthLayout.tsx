import { Link, Outlet } from "react-router-dom";


export default function AuthLayout() {

    return (
        <div>
            <header>
                <h1>login Taquilla</h1>
                <nav>
                    <Link to="login">Iniciar sesión</Link>
                    <Link to="register">Registrarme</Link>
                    
                </nav>
            </header>

            <main>
                <Outlet /> 
            </main>
        </div>
    )
}