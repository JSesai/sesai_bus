import { Route, Routes } from "react-router-dom";
import DashBoardLayout from "../shared/layouts/DashboardLayout";
import RegisterBus from "../Buses/screens/RegisterBus";




export default function RouterDashBoard() {


    return (
        <Route path="buses" element={<DashBoardLayout />}>
            <Route index element={<RegisterBus />} />
            {/* <Route path=":buses" element={<RegisterBus />} /> */}
            <Route path=":buses/clientes" element={<h1>clientes</h1>} />
            <Route path=":buses/boletos" element={<h1>boletos</h1>} />


        </Route>
    )
}