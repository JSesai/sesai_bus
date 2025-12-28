// src/react/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoardLayout from "../shared/layouts/DashboardLayout";
import RegisterBus from "../Buses/screens/RegisterBus";
import AuthLayout from "../auth/layouts/AuthLayout";
import Login from "../auth/screens/Login";
import RegisterUser from "../auth/screens/RegisterUser";
import { AuthProvider } from "../auth/context/AuthContext";
import ForgotPassword from "../auth/screens/ForgotPassword";
import NewPassword from "../auth/screens/NewPassword";

export function AppRouter() {
    return (

        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="auth/" element={<AuthLayout />}>
                        <Route index element={<Login />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<RegisterUser />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="new-password" element={<NewPassword />} />
                    </Route>



                </Routes>

                <Routes>
                    <Route path="dashboard/" element={<DashBoardLayout />}>
                        <Route index element={<h1>este es el home del dash</h1>} />
                        <Route path="buses/register" element={<RegisterBus />} />09
                    </Route>
                </Routes>

                {/* <Route path="dashboard" element={<RouterDashBoard />} /> */}
                {/* <Route path="/drivers" element={<DriverForm />} /> */}
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* <Route path="*" element={<Navigate to={"/auth"} />} /> */}
            </AuthProvider>
        </BrowserRouter>
    );
}
