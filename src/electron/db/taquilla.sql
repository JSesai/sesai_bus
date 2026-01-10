-- 0. Config system
CREATE TABLE IF NOT EXISTS app_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    agency_configured INTEGER DEFAULT 0,
    buses_configured INTEGER DEFAULT 0,
    routes_configured INTEGER DEFAULT 0,
    schedules_configured INTEGER DEFAULT 0,
    initial_setup_completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'active',

);


-- 1. AGENCIES (Sucursales)
CREATE TABLE IF NOT EXISTS agencies (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL,
    location TEXT,
    phone TEXT,
    dynamic_bus_numbering INTEGER NOT NULL DEFAULT 0 -- 0 = fijo, 1 = dinámico

);


-- 2. BUSES (Unidades)
CREATE TABLE IF NOT EXISTS buses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- number TEXT NOT NULL UNIQUE,
    seatingCapacity INTEGER NOT NULL,
    plate TEXT NOT NULL UNIQUE,
    serialNumber TEXT NOT NULL UNIQUE,
    year TEXT NOT NULL,
    model TEXT NOT NULL,
    characteristics TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- asignacion diaria de numero de autobus
CREATE TABLE bus_daily_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_id INTEGER NOT NULL,
    terminal_id INTEGER NOT NULL,
    service_date TEXT NOT NULL, -- YYYY-MM-DD
    bus_number INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'active',

    UNIQUE (terminal_id, service_date, bus_number),
    UNIQUE (bus_id, terminal_id, service_date),

    FOREIGN KEY (bus_id) REFERENCES buses(id)
);


-- 3. DRIVERS (Choferes)

CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    license_number TEXT NOT NULL UNIQUE
);


-- 4. ROUTES (Ruta base Ciudad A → Ciudad B)
CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    terminalName: TEXT NOT NULL,
    stateName: TEXT NOT NULL,
    cityName: TEXT NOT NULL,
    address: TEXT NOT NULL,
    -- destination TEXT NOT NULL,
    baseFare: TEXT NOT NULL,
    estimatedTravelTime:
    distanceFromOriginKm: TEXT NOT NULL,
    remarks: TEXT,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);


-- 5. SCHEDULES (Salidas programadas)

CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id INTEGER NOT NULL,
    bus_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    agency_id INTEGER NOT NULL,
    departure_time TEXT NOT NULL,
    arrival DATETIME NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (agency_id) REFERENCES agencies(id)

    status TEXT NOT NULL DEFAULT 'active',

);


-- 6. CUSTOMERS (Clientes)

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT NOT NULL
    status TEXT NOT NULL DEFAULT 'active',

);


-- 7. TICKETS (Boletos)

CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schedule_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    seat_number INTEGER NOT NULL,
    price REAL NOT NULL,
    purchase_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (schedule_id) REFERENCES schedules(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)

    status TEXT NOT NULL DEFAULT 'active',

);


-- 8. PAYMENTS (Pagos del boleto)

CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    method TEXT NOT NULL,   -- cash, card, transfer
    amount REAL NOT NULL,
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
    status TEXT NOT NULL DEFAULT 'confirmed',

);


-- 9. USERS (Usuarios del sistema)

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    userName TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    status TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'clerk'   -- clerk, admin, supervisor
);
