
import { parse, addMinutes, format, addHours, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";


// Format time
export const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
}

// Format date
export const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export const getInitials = (text: string): string => {
    if (!text) return "";

    const words = text.trim().split(/\s+/);

    const first = words[0]?.charAt(0) ?? "";
    const second = words[1]?.charAt(0) ?? "";

    return (first + second).toUpperCase();
}


export function translateRole(role?: Rol): string {
    if (!role) return ""

    const roleMap: Record<string, string> = {
        developer: "desarrollador",
        manager: "Administrador",
        clerk: "Cajero",
        ticketSeller: "Taquillero",
        driver: "Chofer",
        checkIn: "Checador",
    }

    return roleMap[role] ?? role
}



// Función para sumar minutos a un string "HH:mm"
export const addTimeOnMinutes = (horaStr: string, minutosASumar: number): string => {
    // Parsear el string a un objeto Date
    const date = parse(horaStr, "HH:mm", new Date());

    // Sumar minutos
    const nuevaHora = addMinutes(date, minutosASumar);

    // Formatear de nuevo a "HH:mm"
    return format(nuevaHora, "HH:mm");
}



export const addTimeOnHours = (horaStr: string, horasASumar: number): string => {
    const date = parse(horaStr, "HH:mm", new Date());
    const nuevaHora = addHours(date, horasASumar);
    return format(nuevaHora, "HH:mm");
}



export const sumarHorasYMinutos = (horaBase: string, tiempoASumar: string): string => {
    // Parsear la hora base
    const baseDate = parse(horaBase, "HH:mm", new Date());

    // Separar horas y minutos del tiempo a sumar
    const [horas, minutos] = tiempoASumar.split(":").map(Number);

    // Convertir todo a minutos
    const totalMinutos = horas * 60 + minutos;

    // Sumar minutos
    const nuevaHora = addMinutes(baseDate, totalMinutos);

    // Formatear resultado
    return format(nuevaHora, "HH:mm");
}



export const HHMMToTimestamp = (horaStr: string): number | string => {
    try {
        const [horas, minutos] = horaStr.includes(":") ? horaStr.split(":").map(Number) : [Number(horaStr), 0];
        console.log({ horas, minutos });

        return horas * 60 + minutos;

    } catch (error) {
        return horaStr
    }
};

export const timestamToHHMM = (minutos: number) => {
    const date = new Date(0, 0, 0, 0, minutos); // base ficticia
    return format(date, "HH:mm");
};


// Expresión regular para formato HH:mm 
export const isvalidHour = (horaStr: string): boolean => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    console.log(regex.test(horaStr));

    return regex.test(horaStr);
}

export const getTodayDate = (): string => { return format(new Date(), "yyyy-MM-dd"); };

export const dateInFormatAMD = (date: string): string => { return format(date, "yyyy-MM-dd"); };


export const getDayName = (dateStr: string): string => {
    const date = parseISO(dateStr);
    // convierte "2026-02-11" a objeto Date 
    return format(date, "EEEE", { locale: es }); // devuelve el nombre del día en español 

};

export const minDateToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = today.toISOString().split("T")[0];
    return minDate;
}

export const oneMontFromToday = () => {
    const today = new Date();
    const oneMonthLater = addHours(today, 24 * 30);
    return oneMonthLater.toISOString().split("T")[0];
}

export const oneWeekFromToday = () => {
    const today = new Date();
    const oneWeekLater = addHours(today, 24 * 7);
    return oneWeekLater.toISOString().split("T")[0];
}

/**
 * Convierte una fecha en formato ISO (YYYY-MM-DD) a un formato legible para UI día/mes/año.
 *
 * @param {string} dateString - La fecha en formato ISO (ej. "2026-05-08").
 * @returns {string} La fecha formateada en formato DD/MM/YYYY.
 *
 * @example
 * formatDateDisplay("2026-05-08"); //salida::: "08/05/2026"
 */
export const formatDateDisplay = (dateString: string): string => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy", { locale: es });
}

    ;

/**
 * Convierte una fecha ISO (YYYY-MM-DD) a formato día/mes (DD/MM).
 *
 * @param {string} dateString - Fecha en formato ISO (ej. "2026-05-08").
 * @returns {string} Fecha formateada como "08/05".
 *
 * @example
 * formatDayMonth("2026-05-08"); // "08/05"
 */
export const formatDayMonth = (dateString: string): string => {
    const date = parseISO(dateString);
    return format(date, "dd/MM", { locale: es });
};



export const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const groups = numbers.match(/.{1,4}/g)
    return groups ? groups.join(" ").substr(0, 19) : ""
}

export const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length >= 2) {
        return numbers.substr(0, 2) + "/" + numbers.substr(2, 2)
    }
    return numbers
}


//formatea a moneda mx
export function formatToCurrency(amount: number, currency = 'MXN', locale = 'es-MX') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}


export function parseCurrencyToNumber(currencyString: string, locale = 'es-MX') {
    // Eliminar cualquier símbolo de moneda, espacios y caracteres especiales
    const numericValue = currencyString
        .replace(/[^\d.-]/g, ''); // Mantener solo números, el punto y el guion
    return parseFloat(numericValue);
}
