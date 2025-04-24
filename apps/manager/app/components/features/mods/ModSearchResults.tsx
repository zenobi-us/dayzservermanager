import { ComponentProps } from "react";

import { FullScreenLoader } from "@/components/full-screen-loader";
import { isErrorResponse } from "@/types/response";
import { ModSearchResultList } from "./ModResultList";
import { cn } from "@/lib/utils";
import { useModSearch } from "./useModSearch";



export function ModSearchResults({ className, ...props }: ComponentProps<'div'>) {
    const search = useModSearch();

    return (
        <div className={cn("flex flex-col h-full flex-grow gap-4 rounded-md", className)} {...props}>

            {!!search.store.search_text && search.query.isFetching && (
                <FullScreenLoader />
            )}

            {!!search.store.search_text
                && !search.query.isFetching
                && search.query.isFetched
                && !!search.query.data
                && isErrorResponse(search.query.data)
                && (
                    <pre>{typeof search.query.data.error === 'string' ? search.query.data.error : search.query.data.error?.message}</pre>
                )}

            {!!search.store.search_text
                && !search.query.isFetching
                && search.query.isFetched
                && !!search.query.data
                && !isErrorResponse(search.query.data)
                && (
                    <ModSearchResultList
                        total={search.query.data.data.response.total}
                        results={search.query.data.data.response.publishedfiledetails}
                    />
                )}
        </div>
    )
}



