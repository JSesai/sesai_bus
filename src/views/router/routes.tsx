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
import { BusesSetting } from "../Buses/screens/BusesSetting";
import { BusDailyAssignment } from "../Buses/components/BusDailyAssignment";
import AgencieForm from "../Buses/components/AgencieForm";
import { TicketProvider } from "../auth/context/TicketContext";
import SetupWizard from "../Buses/screens/SetupWizard";
import SetupLayout from "../shared/layouts/SetupLayout";


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
                    <TicketProvider>

                        <Routes>
                            <Route path="setup/" element={<SetupLayout />} >
                                <Route index element={<SetupWizard />} />

                            </Route>
                            
                            <Route path="dashboard/" element={<DashBoardLayout />}>
                                <Route index element={<MainDashboard />} />
                                <Route path="summary" element={<Summary />} />
                                <Route path="agency" element={<AgencieForm />} />
                                <Route path="ticket-sale" element={<TicketSale />} />
                                <Route path="setting" element={<Setting />} />
                                <Route path="setting-bus" element={<BusesSetting />} />
                                <Route path="buses" element={<Buses />} />
                                <Route path="bus-daily-assignment" element={<BusDailyAssignment />} />
                                <Route path="add-bus" element={<RegisterBus />} />
                                <Route path="destinations" element={<Destinations />} />
                                <Route path="schedules" element={<Schedules />} />
                                <Route path="employees" element={<Employees />} />
                                <Route path="customers" element={<Customers />} />
                            </Route>

                        </Routes>

                    </TicketProvider>
                </DashboardProvider>

            </AuthProvider>
        </BrowserRouter>
    );
}
