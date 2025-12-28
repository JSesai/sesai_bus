import { Outlet } from "react-router-dom";
import { getRandomBgClass } from "../../shared/utils/helpers";
import { useAuth } from "../context/AuthContext";




export default function AuthLayout() {

    const { userLogged } = useAuth()
    console.log(userLogged);

    return (
        <div className={`w-full h-screen flex items-center justify-center ${getRandomBgClass()}`}>

            <main >
                <Outlet />
            </main>
        </div>
    )
}