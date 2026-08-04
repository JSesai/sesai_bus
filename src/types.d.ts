declare module "node-machine-id" {
  export function machineIdSync(original?: boolean): string;
  export function machineId(original?: boolean): Promise<string>;
}

declare module "qrcode" {
  export function toDataURL(text: string, options?: { width?: number; margin?: number; color?: { dark?: string; light?: string } }): Promise<string>;
  export function toString(text: string, options?: { type?: string; width?: number; margin?: number }): Promise<string>;
}

type Theme = 'light' | 'dark' | 'system';

interface User {
  id?: number;
  name: string;
  userName: string;
  password?: string;
  status: StatusTypeUser;
  statusConfirmed?: 'confirmed' | 'unconfirmed';
  role: Rol;
  phone: string;
}

type UserSample = Omit<User, 'password'> & { id: number, created_at?: string };
type UserUpdatePass = Omit<User, "id" | "created_at"> & {
  id: number;
  created_at?: string;
};


interface UserCredentials {
  userName: string;
  password: string;
}

interface ResponseHandler {
  ok: boolean;
  data: any;
  error: any
}

type BookingType = "reserve" | "purchase"

interface UsersAPI {
  getById: (id: number) => Promise<User>;
  getByUserName: (userName: User['userName']) => Promise<ResponseElectronUser>;
  getUsers: () => Promise<ResponseElectronGeneric>;
  addUser: (user: User) => Promise<ResponseElectronGeneric>;
  updateUser: (user: UserUpdatePass) => Promise<ResponseElectronGeneric>;
  logout: () => Promise<ResponseElectronGeneric>;
  authUser: (UserCredentials) => Promise<ResponseElectronUser>;
  checkSession: () => Promise<ResponseElectronUser>;
  generateUniqueUserName: (UserCredentials) => Promise<ResponseElectronGeneric>;
}

interface appConfigAPI {
  getAppConfig: () => Promise<ResponseElectronAppConfig>;
  updateAppConfig: (data: Partial<any>) => Promise<ResponseElectronAppConfig>;
}

type IProcessConfirmedPurchase = {
  customerId: number;
  scheduleId: number;
  seatNumbers: number[];
  totalAmount: number;
  paymentMethod: "cash" | "card" | "transfer";
}

type IProcessConfirmedReservation = Omit<IProcessConfirmedPurchase, 'paymentMethod'>;

interface ProcessFlowAPI {
  processConfirmedPurchase: (props: IProcessConfirmedPurchase) => Promise<ResponseElectronGeneric>;
  processConfirmedReservation: (props: IProcessConfirmedReservation) => Promise<ResponseElectronGeneric>;
}

interface Agency {
  id?: number;
  name: string;
  city: string;
  location: string;
  phone: string;
  isCurrent: number;
}

interface AgencyAPI {
  getAgencies: () => Promise<ResponseElectronGeneric>;
  getAgencyLocal: () => Promise<ResponseElectronGeneric>;
  getAgencyById: (id: Agency['id']) => Promise<Agency>;
  addAgency: (agency: Agency) => Promise<ResponseElectronAgencie>;
  updateAgency: (agency: Agency) => Promise<ResponseElectronAgencie>;
  deleteAgency: (id: Agency['id']) => Promise<void>;
}

type TstatusBus = 'active' | 'disabled' | 'removed';
interface Bus {
  id?: number;
  // number: string;
  seatingCapacity: number;
  inapamSeats: number;
  plate: string;
  serialNumber: string;
  year: string;
  model: string;
  characteristics?: string;
  status: TstatusBus;
}

interface BusesAPI {
  getBuses: () => Promise<ResponseElectronBuses>;
  getDailyBusAssignments: (terminalId: number, date: string) => Promise<ResponseElectronBuses>;
  getBusById: (id: Bus['id']) => Promise<Bus>;
  addBus: (bus: Bus) => Promise<ResponseElectronGeneric>;
  deleteBus: (id: Bus['id']) => Promise<ResponseElectronGeneric>;
  updateBus: (bus: Bus) => Promise<ResponseElectronGeneric>;
}

interface Driver {
  id?: number;
  name: string;
  license_number: string;
}

interface Discount {
  id?: number;
  schedule_id: number;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  status?: 'active' | 'inactive';
  created_at?: string;
};

type StatusType = 'active' | 'disabled' | 'removed';

interface Route {
  id?: number;
  origin: Agency['city'];
  terminalName: string;
  cityName: string;
  // stateName: string;
  address: string;
  contactPhone: string;
  distanceFromOriginKm: number;
  baseFare: number;
  baseFareRoundTrip: number;
  estimatedTravelTime: string | number;
  remarks: string;
  status: StatusType

}

interface RouteTravelAPI {
  getRoutes: () => Promise<ResponseElectronRoutesTravel>;
  getRouteById: (id: Route['id']) => Promise<Route>;
  addRoute: (routeTravel: Route) => Promise<ResponseElectronGeneric>;
  updateRoute: (routeTravel: Route) => Promise<ResponseElectronGeneric>;
  deleteRoute: (id: Route['id']) => Promise<void>;
}

interface Schedule {
  id?: number;
  route_id: number; //destino
  bus_id: number; // bus asignado
  driver_id: number; //chofer
  agency_id_origin: number;  //origen
  vehicle_number: number; // numero de venhiculo
  departure_time: string; //hora de salida
  arrival_time: string;   //hora de llegada
  status: StatusType;
  created_at?: string;
  // daysOperation: string[];
  dateDeparture: string;
}

interface ScheduleData extends Schedule {
  agency_name: string;
  bus_model: string;
  bus_plate: string;
  route_name: string;
  driver_name: string;
  city_origin: string;
  city_destination: string;
  terminal_destination: string;
  terminal_origin: string;
}

interface ScheduleAPI {
  getSchedules: () => Promise<ResponseElectronGeneric>;
  getScheduleById: (id: Schedule['id']) => Promise<Schedule>;
  addSchedule: (schedule: Schedule) => Promise<ResponseElectronGeneric>;
  updateSchedule: (schedule: Schedule) => Promise<ResponseElectronGeneric>;
  deleteSchedule: (id: Schedule['id']) => Promise<void>;
  getVehicleSeatStatus: (idSchedule: Schedule['id']) => Promise<ResponseElectronGeneric>;
  addDiscount: (discount: Discount) => Promise<ResponseElectronGeneric>;
  getDiscountsByDate: (date: string) => Promise<ResponseElectronGeneric>;
  updateDiscountStatus: (discountId: number, status: 'active' | 'inactive') => Promise<ResponseElectronGeneric>;
  getDiscountBySchedule: (scheduleId: number) => Promise<ResponseElectronGeneric>;
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
  getCustomerByPhone: (phone: Customer['phone']) => Promise<ResponseElectronGeneric>;
  createOrUpdateCustomer: (customer: Customer) => Promise<ResponseElectronGeneric>;
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
interface TicketInsert {
  scheduleId: number,
  customerId: number,
  seatNumbers: number[],
  price: number,
  return_date?: string;
}
interface TicketAPI {
  getTickets: () => Promise<Ticket>,
  getTicketById: (id: Ticket['id']) => Promise<Ticket[]>;
  addTicket: (ticket: Ticket['id']) => Promise<Ticket>;
  updateTicket: (ticket: Ticket['id']) => Promise<void>;
  deleteTicket: (id: Ticket['id']) => Promise<void>;
  insertSelectedSeats: (ticketInsert: TicketInsert) => Promise<ResponseElectronGeneric>;
  updateTicketStatus: (scheduleId: number, seatNumbers: SeatData['seat_number'][], newStatus: SeatData['status']) => Promise<ResponseElectronGeneric>;
  getReservationsByDate: (dateReservation: string) => Promise<ResponseElectronGeneric>;
  deletedTicketNotcomfirmed: (id: User['id']) => Promise<ResponseElectronGeneric>;
  reassignSeats: (scheduleId: number, customerId: number, oldSeatNumbers: number[], newSeatNumbers: number[]) => Promise<ResponseElectronGeneric>;
  cancelReservation: (scheduleId: number, seatNumbers: number[], purchaseId: number | null, reason: string) => Promise<ResponseElectronGeneric>;
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




type StatusTypeUser = 'registered' | 'active' | 'disabled' | 'deleted' | 'developer'
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

interface ResponseElectronAppConfig {
  ok: boolean,
  data: AppConfig | null;
  error: null | ErrorApp
}

interface ResponseElectronAgencie {
  ok: boolean,
  data: Agency | null;
  error: null | ErrorApp
}

interface ResponseElectronBuses {
  ok: boolean,
  data: Bus[];
  error: null | ErrorApp
}

interface ResponseElectronRoutesTravel {
  ok: boolean,
  data: Route[];
  error: null | ErrorApp
}


type AppConfigStatus = "complete" | "incomplete";

interface AppConfig {
  id?: number;
  agency_configured: number;
  buses_configured: number;
  routes_configured: number;
  schedules_configured: number;
  initial_setup_completed: number;
  min_advance_minutes: number;
  service_fee_percent: number;
  created_at: string;
}

interface SeatData {
  seat_number: number;
  status: "available" | "occupied" | "selected" | "reserved" | "selectedTemporal" | "cancelled";
}



interface BiometricService {
  enroll(userId: number): Promise<string>;
  authenticate(): Promise<string | null>;
}

interface TicketPrintData {
  agencyName: string;
  agencyCity: string;
  agencyPhone: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengerName: string;
  seatNumbers: number[];
  totalAmount: number;
  isRoundTrip: boolean;
  returnDate?: string;
  purchaseDate?: string;
  ticketId?: string;
  ticketIds?: number[];
}

interface PrinterAPI {
  print: (ticketData: TicketPrintData) => Promise<{ ok: boolean; method: "printer" | "pdf"; pdfData?: string }>;
  checkStatus: () => Promise<{ connected: boolean }>;
}

interface License {
  machineId: string;
  licenseKey: string;
  licenseType: 'standard' | 'trial' | 'enterprise';
  maxUsers: number;
  expiresAt: string;
  signature: string;
  activatedAt: string;
}

interface LicenseActivation {
  licenseKey: string;
}

interface LicenseStatus {
  valid: boolean;
  license: License | null;
  daysRemaining: number | null;
  expired: boolean;
  message: string;
}

interface LicenseAPI {
  activateLicense: (data: LicenseActivation) => Promise<ResponseElectronLicense>;
  checkLicense: () => Promise<ResponseElectronLicense>;
  getLicenseStatus: () => Promise<ResponseElectronLicenseStatus>;
}

interface ResponseElectronLicense {
  ok: boolean;
  data: LicenseStatus | null;
  error: null | ErrorApp;
}

interface ResponseElectronLicenseStatus {
  ok: boolean;
  data: LicenseStatus | null;
  error: null | ErrorApp;
}

interface DepartureBoardData {
  id: number;
  departure_time: string;
  arrival_time: string;
  vehicle_number: number;
  status: StatusType;
  dateDeparture: string;
  terminal_destination: string;
  city_destination: string;
  city_origin: string;
  estimatedTravelTime: number;
  bus_plate: string;
  bus_model: string;
  seatingCapacity: number;
  driver_name: string;
  agency_name: string;
  occupied_seats: number;
}

interface WaitingRoomConfig {
  fontScale: number;
  isOpen: boolean;
}

interface BoardingDeparture extends DepartureBoardData {
  boarded_seats: number;
}

interface BoardingManifestRow {
  ticket_id: number;
  seat_number: number;
  price: number;
  status: string;
  boarded_at: string | null;
  boarded_by: number | null;
  return_date: string | null;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
}

interface BoardingTicketInfo {
  ticket_id: number;
  seat_number: number;
  price: number;
  status: string;
  boarded_at: string | null;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  schedule_id: number;
  departure_time: string;
  dateDeparture: string;
  vehicle_number: number;
  city_origin: string;
  city_destination: string;
}

interface BoardingAPI {
  getDeparturesByDate: (date: string) => Promise<ResponseElectronGeneric>;
  getBoardingManifest: (scheduleId: number) => Promise<ResponseElectronGeneric>;
  getTicketsByIds: (ticketIds: number[]) => Promise<ResponseElectronGeneric>;
  markBoarded: (ticketIds: number[], userId: number) => Promise<ResponseElectronGeneric>;
  unmarkBoarded: (ticketIds: number[]) => Promise<ResponseElectronGeneric>;
  getPin: () => Promise<ResponseElectronGeneric>;
  regeneratePin: () => Promise<ResponseElectronGeneric>;
  getServerUrl: () => Promise<ResponseElectronGeneric>;
}

interface ICashClosing {
  id?: number;
  agency_id: number;
  user_id: number;
  closing_date: string;
  opening_time: string;
  closing_time?: string;
  total_cash: number;
  total_card: number;
  total_transfer: number;
  total_sales: number;
  total_reservations: number;
  total_cancellations: number;
  total_service_fees: number;
  transaction_count: number;
  status: 'open' | 'closed';
  notes?: string;
  created_at?: string;
}

interface ICashSummaryByMethod {
  method: 'cash' | 'card' | 'transfer';
  purchase_count: number;
  total_amount: number;
  ticket_count: number;
}

interface ICashClosingSummary {
  byMethod: ICashSummaryByMethod[];
  totalSales: number;
  totalReservations: number;
  totalCancellations: number;
  totalServiceFees: number;
  transactionCount: number;
  cancelledAmount: number;
}

interface ICashTransaction {
  id: number;
  customer_name: string;
  customer_phone: string;
  origin: string;
  destination: string;
  departure_time: string;
  date_departure: string;
  seat_numbers: string;
  ticket_count: number;
  amount: number;
  method: string;
  payment_status: string;
  purchase_status: string;
  created_at: string;
}

interface CashClosingAPI {
  openCashClosing: (userId: number, agencyId: number) => Promise<ResponseElectronGeneric>;
  getActiveCashClosing: (agencyId: number) => Promise<ResponseElectronGeneric>;
  getCashClosingSummary: (agencyId: number, date: string) => Promise<ResponseElectronGeneric>;
  getCashClosingPeriodSummary: (agencyId: number, fromDate: string, toDate: string) => Promise<ResponseElectronGeneric>;
  getCashClosingTransactions: (agencyId: number, date: string) => Promise<ResponseElectronGeneric>;
  closeCashClosing: (closingId: number, notes?: string) => Promise<ResponseElectronGeneric>;
  getCashClosingHistory: (agencyId: number) => Promise<ResponseElectronGeneric>;
}

interface WaitingRoomAPI {
  open: () => Promise<ResponseElectronGeneric>;
  close: () => Promise<ResponseElectronGeneric>;
  toggle: () => Promise<{ ok: boolean; data: { isOpen: boolean }; error: null | ErrorApp }>;
  getStatus: () => Promise<{ ok: boolean; data: { isOpen: boolean }; error: null | ErrorApp }>;
  getTodayDepartures: () => Promise<ResponseElectronGeneric>;
  getUrl: () => Promise<{ ok: boolean; data: { url: string; port: number }; error: null | ErrorApp }>;
  getConfig: () => Promise<{ ok: boolean; data: WaitingRoomConfig; error: null | ErrorApp }>;
  saveConfig: (config: Partial<WaitingRoomConfig>) => Promise<ResponseElectronGeneric>;
}

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  id: number;
  ts: string;
  level: LogLevel;
  scope: string;
  message: string;
}

interface LogsAPI {
  get: (opts?: { limit?: number; level?: LogLevel }) => Promise<{ ok: boolean; data: { entries: LogEntry[] }; error: null | ErrorApp }>;
  clear: () => Promise<ResponseElectronGeneric>;
  write: (level: LogLevel, scope: string, message: string, meta?: any) => Promise<ResponseElectronGeneric>;
}

interface Window {
  electron: {
    users: UsersAPI;
    agency: AgencyAPI;
    buses: BusesAPI;
    routesTravel: RouteTravelAPI;
    schedules: ScheduleAPI;
    customers: CustomersAPI;
    tickets: TicketAPI;
    payments: PaymentsAPI;
    biometric: BiometricService;
    appConfig: appConfigAPI;
    processFlow: ProcessFlowAPI;
    printer: PrinterAPI;
    license: LicenseAPI;
    waitingRoom: WaitingRoomAPI;
    cashClosing: CashClosingAPI;
    boarding: BoardingAPI;
    logs: LogsAPI;
  };
}
