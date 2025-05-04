import { IconX } from "@tabler/icons-react";
import { DrawerClose } from "./ui/drawer";
import { cn } from ":lib/utils";

export function DrawerCloseButton() {
    return (
        <DrawerClose className={cn(
            'absolute top-0 right-0 cursor-pointer p-1',
            'rounded-bl-md rounded-tr-md bg-black/5 hover:bg-black/20 transition-colors',
            // 'stroke-gray-400 hover:stroke-black'
        )}>
            <IconX
                size={32}
            />
        </DrawerClose>
    )
}