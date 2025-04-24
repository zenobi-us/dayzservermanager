import { Store } from "@tanstack/react-store";
import { useServerFn } from '@tanstack/react-start'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { UrlSearchParamsFromObject } from "@/core/params";

import * as api from '../../../core/api'
import type { IPublishedFileServiceQueryFilesRequestParams } from "@dayzserver/sdk";
import { isErrorResponse } from "@/types/response";



export const modSearchStore = new Store({
    search_text: '',
    page: 1,
    numperpage: 10,
})


export const setSearchParams = (options: Partial<typeof modSearchStore['state']> = {}) => {
    modSearchStore.setState((state) => {
        const newState = ({
            ...state,
            ...options
        })

        return newState;
    })
}

export const resetSearch = () => {
    setSearchParams({
        search_text: '',
        numperpage: 10,
        page: 1
    })
}

export const setPage = (page: number) => {
    setSearchParams({ page })

}
export const setSearchText = (search_text?: string) => {
    setSearchParams({ search_text })

}

export const setPageSize = (numperpage: number) => {
    setSearchParams({ numperpage })
}

export const useModSearchQuery = (data: IPublishedFileServiceQueryFilesRequestParams) => {
    const search = useServerFn(api.mods.searchWorkshop)

    const query = useQuery({
        enabled: !!data.search_text,
        queryKey: ['modsearch', UrlSearchParamsFromObject(data).toString()],
        queryFn: async () => {
            const results = await search({ data })
            if (!isErrorResponse(results)) {
                return results.data
            }
            throw new Error(results.errorCode)
        },
    })

    return query
}