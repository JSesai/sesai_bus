import { Route, Routes } from "react-router-dom";
import RegisterBus from "../screens/RegisterBus";
import UpdateRegisterBus from "../screens/UpdateRegisterBus";



export default function RouterBuses() {


    return (
        <Routes>
            <Route index element={<RegisterBus />} />
            <Route path="/update" element={<UpdateRegisterBus />} />


        </Routes>
    )
}