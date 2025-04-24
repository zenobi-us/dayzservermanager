import { ComponentProps } from "react";

import { FullScreenLoader } from "@/components/full-screen-loader";
import { ModSearchResultList } from "./ModResultList";
import { cn } from "@/lib/utils";


export function ModSearchResults({ total, publishedfiledetails, isFetching, className, ...props }: ComponentProps<'div'> & {
    isFetching?: boolean;
} & ComponentProps<typeof ModSearchResultList>) {

    return (
        <div className={cn("flex flex-col h-full flex-grow gap-4 rounded-md", className)} {...props}>
            {!!isFetching && (
                <FullScreenLoader />
            )}

            {!isFetching && !!publishedfiledetails && (
                <ModSearchResultList
                    total={total}
                    publishedfiledetails={publishedfiledetails}
                />
            )}
        </div>
    )
}



