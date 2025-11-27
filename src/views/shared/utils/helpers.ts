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
        "bg-gradient-to-br from-gray-100 to-gray-300",
        "bg-gradient-to-br from-blue-100 to-blue-300",
        "bg-gradient-to-br from-green-100 to-green-300",
        "bg-gradient-to-br from-blue-50 to-blue-200",
        "bg-gradient-to-br from-purple-100 to-purple-300",
        "bg-gradient-to-br from-indigo-100 to-indigo-300",
        "bg-gradient-to-br from-pink-50 to-pink-200",
        "bg-gradient-to-br from-slate-200 to-slate-400",

    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
