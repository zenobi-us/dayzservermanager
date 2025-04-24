import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as api from '../../../core/api'
import { IconDownload } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ComponentProps } from "react";


function useDownloadModMutation() {
    const download = useServerFn(api.mods.installMod)
    return useMutation({ mutationFn: download })
}

export function DownloadModButton({ modId, className, ...props }: ComponentProps<'button'> & { modId: string }) {
    const download = useDownloadModMutation()
    return (
        <Button {...props}
            onClick={() => download.mutate({ data: { modId } })}
            className={cn("absolute right-0 bottom-0 m-4", className)}
        >
            <IconDownload />
            Download
        </Button>
    )
}