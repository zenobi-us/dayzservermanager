import { Store } from "@tanstack/react-store";
import { useServerFn } from '@tanstack/react-start'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { IPublishedFileServiceQueryFilesRequestParams } from "@dayzserver/sdk/steamSchema";

import * as api from '../../../core/api'
import { Key } from "lucide-react";
import { UrlSearchParamsFromObject } from "@/core/params";


export function useModSearchQuery(data: IPublishedFileServiceQueryFilesRequestParams) {
    const queryKey = ['modsearch', UrlSearchParamsFromObject(data).toString()]
    const client = useQueryClient()
    const modSearchQuery = useServerFn(api.steam.searchWorkshop);
    const query = useQuery({
        enabled: !!data.search_text && data.search_text.length > 3,
        queryKey,
        queryFn: () => {
            if (!data.search_text) {
                return
            }
            return modSearchQuery({ data })
        }
    })

    const invalidate = () => client.invalidateQueries({
        queryKey
    })

    return {
        ...query,
        invalidate
    }
}


export const modSearchStore = new Store({
    search_text: '',
    page: 1,
    numperpage: 10
})


export const search = (options: Partial<typeof modSearchStore['state']> = {}) => {
    modSearchStore.setState((state) => {
        const newState = ({
            ...state,
            ...options
        })

        return newState;
    })
}

export const resetSearch = () => {
    search({
        search_text: '',
        numperpage: 10,
        page: 1
    })
}

export const setPage = (page: number) => {
    search({ page })

}

export const setPageSize = (numperpage: number) => {
    search({ numperpage })
}
