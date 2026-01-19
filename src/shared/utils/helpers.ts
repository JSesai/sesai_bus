
import { parse, addMinutes, format, addHours } from "date-fns";


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