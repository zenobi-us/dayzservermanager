import { IconLoader } from "@tabler/icons-react";

export function FullScreenLoader() {
    return (
        <div className="flex flex-grow items-center justify-center">
            <IconLoader className="animate-spin" size={32}/>
        </div>
    )
}