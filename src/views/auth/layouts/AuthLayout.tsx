import { Outlet } from "react-router-dom";
import { getRandomBgClass } from "../../shared/utils/helpers";
import { useContext } from "react";
import { AuthContext, useAuth } from "../context/AuthContext";




export default function AuthLayout() {

    const { user } = useAuth()
    console.log(user);

    return (
        <div className={`w-full h-screen flex items-center justify-center ${getRandomBgClass()}`}>

            <main>
                <Outlet />
            </main>
        </div>
    )
}