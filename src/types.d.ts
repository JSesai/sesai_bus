

interface User {
  id?: number;
  name: string;
  userName: string;
  password: string;
  status: StatusType;
  role: Rol;
  phone: string;
}

interface UserCredentials {
  userName: string;
  password: string;
}

interface ResponseHandler {
  ok: boolean;
  data: any;
  error: any
}


interface UsersAPI {
  getById: (id: number) => Promise<User>;
  getByUserName: (userName: User['userName']) => Promise<ResponseElectronUser>;
  getUsers: () => Promise<User[]>;
  addUser: (user: User) => Promise<ResponseElectronUser>;
  updateUser: (user: User) => Promise<ResponseElectronGeneric>;
  logout: () => Promise<ResponseElectronGeneric>;
  delete: (id: number) => Promise<void>;
  authUser: (UserCredentials) => Promise<ResponseElectronUser>;
  checkSession: () => Promise<ResponseElectronUser>;
  generateUniqueUserName: (UserCredentials) => Promise<ResponseElectronGeneric>;
}

interface Agency {
  id?: number;
  name: string;
  location: string;
  phone: string;
}

interface AgencieAPI {
  getAgencies: () => Promise<Agency[]>;
  getAgencyById: (id: Agency['id']) => Promise<Agency>;
  addAgency: (agency: Agency) => Promise<void>;
  updateAgency: (agency: Agency) => Promise<void>;
  deleteAgency: (id: Agency['id']) => Promise<void>;
}

interface Bus {
  id: number;
  number: number;
  capacity: number;
}

interface BusesAPI {
  getBuses: () => Promise<Bus[]>;
  getBusById: (id: Bus['id']) => Promise<Bus>;
  addBus: (bus: Bus) => Promise<Bus>;
  deleteBus: (id: Bus['id']) => Promise<void>;
  updateBus: (id: Bus['id']) => Promise<void>;
}

interface Driver {
  id?: number;
  name: string;
  license_number: string;
}

interface BusesAPI {
  getDrivers: () => Promise<Driver[]>;
  getDriverById: (id: Driver['id']) => Promise<Driver>;
  addDriver: (driver: Driver) => Promise<Driver>;
  updateDriver: (driver: Driver) => Promise<void>;
  deleteDriver: (id: Driver['id']) => Promise<void>;
}



interface Route {
  id?: number;
  origin: string;
  destination: string;
  distance_km?: number;
}

interface RouteTravelAPI {
  getRoutes: () => Promise<Route[]>;
  getRouteById: (id: Route['id']) => Promise<Route>;
  addRoute: (routeTravel: Route) => Promise<Route>;
  updateRoute: (routeTravel: Route) => Promise<void>;
  deleteRoute: (id: Route['id']) => Promise<void>;
}

interface Schedule {
  id?: number;
  route_id: number;
  bus_id: number;
  driver_id: number;
  agency_id: number;
  departure_time: string; // ISO string o formato de tu preferencia
  arrival: string;        // ISO string o formato de tu preferencia
}

interface ScheduleAPI {
  getSchedules: () => Promise<Schedule[]>;
  getScheduleById: (id: Schedule['id']) => Promise<Schedule>;
  addSchedule: (schedule: Schedule) => Promise<Schedule>;
  updateSchedule: (schedule: Schedule['id']) => Promise<void>;
  deleteSchedule: (id: Schedule['id']) => Promise<void>;
}

interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone: string;
}

interface CustomersAPI {
  getCustomers: () => Promise<Customer[]>;
  getCustomerById: (id: Customer['id']) => Promise<Customer>;
  addCustomer: (customer: Customer) => Promise<Customer>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: Customer['id']) => Promise<void>;
}

interface Ticket {
  id?: number;
  schedule_id: number;
  customer_id: number;
  seat_number: number;
  price: number;
  purchase_time?: string;
}

interface TicketAPI {
  getTickets: () => Promise<Ticket>,
  getTicketById: (id: Ticket['id']) => Promise<Ticket[]>;
  addTicket: (ticket: Ticket['id']) => Promise<Ticket>;
  updateTicket: (ticket: Ticket['id']) => Promise<void>;
  deleteTicket: (id: Ticket['id']) => Promise<void>;
}

interface Payment {
  id?: number;
  ticket_id: number;
  method: "cash" | "card" | "transfer";
  amount: number;
  timestamp?: string;
}

interface PaymentsAPI {
  getPayments: () => Promise<Payment[]>
  getPaymentById: (id: Payment['id']) => Promise<Payment>
  addPayment: (payment: Payment) => Promise<Payment>
  updatePayment: (payment: Payment) => Promise<void>
  deletePayment: (id: Payment['id']) => Promise<void>
}




type StatusType = 'registered' | 'active' | 'disabled' | 'deleted' | 'developer'
type Rol = 'developer' | 'manager' | 'driver' | 'ticketSeller' | 'checkIn' | null

interface ErrorApp {
  message: string;
  detail: string;
}

type UserResponseAuth = Omit<User, "password">

interface ResponseElectronUser {
  ok: boolean;
  data: UserResponseAuth | null;
  error: null | ErrorApp
}

interface ResponseElectronGeneric {
  ok: boolean,
  data: any;
  error: null | ErrorApp
}


interface BiometricService {
  enroll(userId: number): Promise<string>;
  authenticate(): Promise<string | null>;
}

interface Window {
  electron: {
    users: UsersAPI;
    agencie: AgencieAPI;
    buses: BusesAPI;
    routeTravel: RouteTravelAPI;
    schedules: ScheduleAPI;
    customers: CustomersAPI
    tickets: TicketAPI;
    payments: PaymentsAPI;
    biometric: BiometricService;

  };
}
