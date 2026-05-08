export function getRandomBgClass() {
    const colors = [
        "bg-gray-50",
        "bg-blue-100",
        "bg-green-100",
        "bg-yellow-100",
        "bg-blue-50",
        "bg-purple-100",
        "bg-indigo-100",
        "bg-pink-50",
        "bg-slate-200",

    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}


export const toCapitalCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


