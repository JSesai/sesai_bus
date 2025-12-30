import type { LucideIcon } from "lucide-react";
import { Button } from "../../components/ui/button";

type size = 's' | 'm' | 'l' | 'xl'

interface Props {
    icon: LucideIcon;
    label: string;
    size?: size;
}

const sizer = (s: size) => {

    switch (s) {
        case 's':
            return { text: 'text-xs', size: 'h-5 w-5' };

        case 'm':
            return { text: 'text-md', size: 'h-7 w-7' };
        case 'l':
            return { text: 'text-lg', size: 'h-9 w-9' };
        case 'xl':
            return { text: 'text-xl', size: 'h-10 w-10' };

        default:
            return { text: 'text-xs', size: 'h-5 w-5' };

    }
}

// Action button component
export default function ActionButton({ icon: Icon, label, size }: Props) {
    return (
        <Button
            variant="outline"
            className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
        >
            <Icon className={`h-10 w-10 text-cyan-500`} />
            <span className={sizer(size ?? 's').text}>{label}</span>
        </Button>
    )
}
