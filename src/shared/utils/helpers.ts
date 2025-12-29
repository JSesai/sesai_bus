

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
