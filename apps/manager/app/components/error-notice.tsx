import { IconError404 } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

export function ErrorNotice({ children }: PropsWithChildren) {
    return (
        <div className="rounded-sm p-2 border border-red-400 bg-red-50 text-red-900 flex gap-2">
            <IconError404 />
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    )
}