import { Outlet } from "react-router-dom";


export default function DashBoardLayout() {
    return (

        <div >

            <main>
                <Outlet /> 
            </main>
        </div>


    )
}