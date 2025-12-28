const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  users: {
    getById: (id: User['id']) => ipcRenderer.invoke("getById", id),
    getUsers: () => ipcRenderer.invoke("getUsers"),
    addUser: (user: User) => ipcRenderer.invoke("addUser", user),
    updateUser: (user: User) => ipcRenderer.invoke("updateUser", user),
    deleteUser: (id: User['id']) => ipcRenderer.invoke("deleteUser", id),
    authUser: (credentials: Credential) => ipcRenderer.invoke("authUser", credentials),
    checkSession: () => ipcRenderer.invoke("checkSession"),
    generateUniqueUserName: (userName: User['userName']) => ipcRenderer.invoke("generateUniqueUserName", userName),
    
  },

  agencies: {
    getAgencies: () => ipcRenderer.invoke('getAgencies'),
    getAgencyById: (id: Agency['id']) => ipcRenderer.invoke("getAgencyById", id),
    addAgency: (agency: Agency) => ipcRenderer.invoke("addAgency", agency),
    updateAgency: (agency: Agency) => ipcRenderer.invoke("updateAgency", agency),
    deleteAgency: (id: Agency['id']) => ipcRenderer.invoke("deleteAgency", id),
  },

  buses: {
    getBuses: () => ipcRenderer.invoke("getBuses"),
    getBusById: (id: Bus['id']) => ipcRenderer.invoke("getBusById", id),
    addBus: (bus: Bus) => ipcRenderer.invoke("addBus", bus),
    deleteBus: (id: Bus['id']) => ipcRenderer.invoke("deleteBus", id),
    updateBus: (bus: Bus) => ipcRenderer.invoke("deleteBus", bus),

  },

  drivers: {
    getDrivers: () => ipcRenderer.invoke("getDrivers"),
    getDriverById: (id: Driver['id']) => ipcRenderer.invoke("getDriverById", id),
    addDriver: (driver: Driver) => ipcRenderer.invoke("addDriver", driver),
    updateDriver: (driver: Driver) => ipcRenderer.invoke("updateDriver", driver),
    deleteDriver: (id: Driver['id']) => ipcRenderer.invoke("deleteDriver", id),
  },

  routesTravel: {
    getRoutes: () => ipcRenderer.invoke("getRoutes"),
    getRouteById: (id: Route['id']) => ipcRenderer.invoke("getRouteById", id),
    addRoute: (routeTravel: Route) => ipcRenderer.invoke("addRoute", routeTravel),
    updateRoute: (routeTravel: Route) => ipcRenderer.invoke("updateRoute", routeTravel),
    deleteRoute: (id: Route['id']) => ipcRenderer.invoke("deleteRoute", id),
  },

  schedules: {
    getSchedules: () => ipcRenderer.invoke("getSchedules"),
    getScheduleById: (id: Schedule['id']) => ipcRenderer.invoke("getScheduleById", id),
    addSchedule: (schedule: Schedule) => ipcRenderer.invoke("addSchedule", schedule),
    updateSchedule: (schedule: Schedule['id']) => ipcRenderer.invoke("updateSchedule", schedule),
    deleteSchedule: (id: Schedule['id']) => ipcRenderer.invoke("deleteSchedule", id),
  },

  customers: {
    getCustomers: () => ipcRenderer.invoke("getCustomers"),
    getCustomerById: (id: Customer['id']) => ipcRenderer.invoke("getCustomerById", id),
    addCustomer: (customer: Customer) => ipcRenderer.invoke("addCustomer", customer),
    updateCustomer: (customer: Customer) => ipcRenderer.invoke("updateCustomer", customer),
    deleteCustomer: (id: Customer['id']) => ipcRenderer.invoke("deleteCustomer", id)
  },

  tickets: {
    getTickets: () => ipcRenderer.invoke("getTickets"),
    getTicketById: (id: Ticket['id']) => ipcRenderer.invoke("getTicketById", id),
    addTicket: (ticket: Ticket['id']) => ipcRenderer.invoke("addTicket", ticket),
    updateTicket: (ticket: Ticket['id']) => ipcRenderer.invoke("updateTicket", ticket),
    deleteTicket: (id: Ticket['id']) => ipcRenderer.invoke("deleteTicket", id),
  },

  payments: {
    getPayments: () => ipcRenderer.invoke("getPayments"),
    getPaymentById: (id: Payment['id']) => ipcRenderer.invoke("getPaymentById", id),
    addPayment: (payment: Payment) => ipcRenderer.invoke("addPayment", payment),
    updatePayment: (payment: Payment) => ipcRenderer.invoke("updatePayment", payment),
    deletePayment: (id: Payment['id']) => ipcRenderer.invoke("deletePayment", id),
  },

  biometric: {
    enroll: (userId: number) => ipcRenderer.invoke("biometric:enroll", userId),
    authenticate: () => ipcRenderer.invoke("biometric:auth"),
  }


});
