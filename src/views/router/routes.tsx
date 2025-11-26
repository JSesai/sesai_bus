// src/react/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RouterBuses from "../Buses/routes/RoutesBuses";
import RouterDashBoard from "../DashBoard/RouterDashBoard";
import DashBoardLayout from "../shared/layouts/DashboardLayout";
import RegisterBus from "../Buses/screens/RegisterBus";
import AuthLayout from "../auth/layouts/AuthLayout";
import Login from "../auth/screens/Login";
import RegisterUser from "../auth/screens/RegisterUser";

export function AppRouter() {
    return (

        <BrowserRouter>
            <Routes>

                <Route path="/" element={<AuthLayout />}>
                    <Route index element={<Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<RegisterUser />} />
                </Route>

                <Route path="dashboard" element={<DashBoardLayout />}>
                    <Route index element={<h1>este es el home del dash</h1>} />
                    <Route path="buses/register" element={<RegisterBus />} />09
                </Route>

                {/* <Route path="dashboard" element={<RouterDashBoard />} /> */}
                {/* <Route path="/drivers" element={<DriverForm />} /> */}
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            </Routes>
        </BrowserRouter>
    );
}
