const { ipcRenderer, contextBridge } = require("electron");


const usersAPI: UsersAPI = {
  getById: (id: User['id']) => ipcRenderer.invoke("getById", id),
  getByUserName: (userName: User['userName']) => ipcRenderer.invoke("getByUserName", userName),
  getUsers: () => ipcRenderer.invoke("getUsers"),
  addUser: (user: User) => ipcRenderer.invoke("addUser", user),
  updateUser: (user: User) => ipcRenderer.invoke("updateUser", user),
  authUser: (credentials: Credential) => ipcRenderer.invoke("authUser", credentials),
  logout: () => ipcRenderer.invoke("logout"),
  checkSession: () => ipcRenderer.invoke("checkSession"),
  generateUniqueUserName: (userName: User['userName']) => ipcRenderer.invoke("generateUniqueUserName", userName),

}

const agencyAPI: AgencyAPI = {
  getAgency: () => ipcRenderer.invoke('getAgency'),
  getAgencyById: (id: Agency['id']) => ipcRenderer.invoke("getAgencyById", id),
  addAgency: (agency: Agency) => ipcRenderer.invoke("addAgency", agency),
  updateAgency: (agency: Agency) => ipcRenderer.invoke("updateAgency", agency),
  deleteAgency: (id: Agency['id']) => ipcRenderer.invoke("deleteAgency", id),
}

const busesAPI: BusesAPI =  {
  getBuses: () => ipcRenderer.invoke("getBuses"),
  getBusById: (id: Bus['id']) => ipcRenderer.invoke("getBusById", id),
  addBus: (bus: Bus) => ipcRenderer.invoke("addBus", bus),
  deleteBus: (id: Bus['id']) => ipcRenderer.invoke("deleteBus", id),
  updateBus: (bus: Bus) => ipcRenderer.invoke("updateBus", bus),
  getDailyBusAssignments: (terminalId: number, date: string) => ipcRenderer.invoke("getDailyBusAssignments", { terminalId, date })
}

const routesTravelAPI: RouteTravelAPI ={
  getRoutes: () => ipcRenderer.invoke("getRoutes"),
  getRouteById: (id: Route['id']) => ipcRenderer.invoke("getRouteById", id),
  addRoute: (routeTravel: Route) => ipcRenderer.invoke("addRoute", routeTravel),
  updateRoute: (routeTravel: Route) => ipcRenderer.invoke("updateRoute", routeTravel),
  deleteRoute: (id: Route['id']) => ipcRenderer.invoke("deleteRoute", id),
}

const schedulesAPI: ScheduleAPI = {
  getSchedules: () => ipcRenderer.invoke("getSchedules"),
  getScheduleById: (id: Schedule['id']) => ipcRenderer.invoke("getScheduleById", id),
  addSchedule: (schedule: Schedule) => ipcRenderer.invoke("addSchedule", schedule),
  updateSchedule: (schedule: Schedule) => ipcRenderer.invoke("updateSchedule", schedule),
  deleteSchedule: (id: Schedule['id']) => ipcRenderer.invoke("deleteSchedule", id),
}

const customerAPI: CustomersAPI = {
  getCustomers: () => ipcRenderer.invoke("getCustomers"),
  getCustomerById: (id: Customer['id']) => ipcRenderer.invoke("getCustomerById", id),
  addCustomer: (customer: Customer) => ipcRenderer.invoke("addCustomer", customer),
  updateCustomer: (customer: Customer) => ipcRenderer.invoke("updateCustomer", customer),
  deleteCustomer: (id: Customer['id']) => ipcRenderer.invoke("deleteCustomer", id)
}

const ticketAPI: TicketAPI =  {
  getTickets: () => ipcRenderer.invoke("getTickets"),
  getTicketById: (id: Ticket['id']) => ipcRenderer.invoke("getTicketById", id),
  addTicket: (ticket: Ticket['id']) => ipcRenderer.invoke("addTicket", ticket),
  updateTicket: (ticket: Ticket['id']) => ipcRenderer.invoke("updateTicket", ticket),
  deleteTicket: (id: Ticket['id']) => ipcRenderer.invoke("deleteTicket", id),
}

const paymetsAPI: PaymentsAPI = {
  getPayments: () => ipcRenderer.invoke("getPayments"),
  getPaymentById: (id: Payment['id']) => ipcRenderer.invoke("getPaymentById", id),
  addPayment: (payment: Payment) => ipcRenderer.invoke("addPayment", payment),
  updatePayment: (payment: Payment) => ipcRenderer.invoke("updatePayment", payment),
  deletePayment: (id: Payment['id']) => ipcRenderer.invoke("deletePayment", id),
}

const biometricAPI: BiometricService = {
  enroll: (userId: number) => ipcRenderer.invoke("biometric:enroll", userId),
  authenticate: () => ipcRenderer.invoke("biometric:auth"),
}

const appConfiAPI: appConfigAPI = {
  getAppConfig :() => ipcRenderer.invoke("getAppConfig")
}

contextBridge.exposeInMainWorld("electron", {
  users: usersAPI,
  agency: agencyAPI,
  buses:busesAPI,
  routesTravel: routesTravelAPI,
  schedules: schedulesAPI,
  customers: customerAPI ,
  tickets: ticketAPI,
  payments: paymetsAPI,
  biometric: biometricAPI,
  appConfig: appConfiAPI


});
