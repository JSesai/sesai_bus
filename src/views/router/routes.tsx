import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoardLayout from "../shared/layouts/DashboardLayout";
import RegisterBus from "../Buses/screens/RegisterBus";
import AuthLayout from "../auth/layouts/AuthLayout";
import Login from "../auth/screens/Login";
import RegisterUser from "../auth/screens/RegisterUser";
import { AuthProvider } from "../auth/context/AuthContext";
import ForgotPassword from "../auth/screens/ForgotPassword";
import NewPassword from "../auth/screens/NewPassword";
import Summary from "../Buses/screens/Summary";
import MainDashboard from "../Buses/components/MainDashboard";
import { TicketSale } from "../Buses/screens/TicketSale";
import Setting from "../Buses/screens/Setting";
import Destinations from "../Buses/screens/Destinations";
import Schedules from "../Buses/screens/Schedules";
import Employees from "../Buses/screens/Employees";
import Customers from "../Buses/screens/Customers";
import { DashboardProvider } from "../auth/context/DashBoardContext";
import Buses from "../Buses/screens/Buses";


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

                <DashboardProvider>
                    <Routes>

                        <Route path="dashboard/" element={<DashBoardLayout />}>
                            <Route index element={<MainDashboard />} />
                            <Route path="summary" element={<Summary />} />
                            <Route path="ticket-sale" element={<TicketSale />} />
                            <Route path="setting" element={<Setting />} />
                            <Route path="buses" element={<Buses />} />
                            <Route path="add-bus" element={<RegisterBus />} />
                            <Route path="destinations" element={<Destinations />} />
                            <Route path="schedules" element={<Schedules />} />
                            <Route path="employees" element={<Employees />} />
                            <Route path="customers" element={<Customers />} />
                        </Route>
                    </Routes>
                </DashboardProvider>

                {/* <Route path="dashboard" element={<RouterDashBoard />} /> */}
                {/* <Route path="/drivers" element={<DriverForm />} /> */}
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* <Route path="*" element={<Navigate to={"/auth"} />} /> */}
            </AuthProvider>
        </BrowserRouter>
    );
}
