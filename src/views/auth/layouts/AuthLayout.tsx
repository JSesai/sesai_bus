import { Outlet } from "react-router-dom";
import { getRandomBgClass } from "../../shared/utils/helpers";




export default function AuthLayout() {

    return (
        <div className={`w-full h-screen flex items-center justify-center ${getRandomBgClass()}`}>

        

            <main>
                <Outlet /> 
            </main>
        </div>
    )
}