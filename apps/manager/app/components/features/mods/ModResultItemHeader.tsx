import type { PropsWithChildren } from "react";
import { IconDownload } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export const ModResultItemHeader = ({ children, onDownloadClick }: PropsWithChildren<
    {
        onDownloadClick: () => void
    }
>) => {
    return (
        <div className="grid grid-flow-row gap-4 grid-cols-(--grid-cols)"
        >
            <div className="col-span-4 md:col-span-2">
                {children}
            </div>
            <Button variant='outline' size='sm' className="col-span-2 md:col-span-1" onClick={onDownloadClick}>
                <IconDownload /> Download
            </Button>
        </div>

    )
}