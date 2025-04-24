import { Store, useStore } from "@tanstack/react-store";
import { useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'

import { IPublishedFileServiceQueryFilesRequestParams } from "@dayzserver/sdk/steamSchema";

import * as api from '../../../core/api'

function useModSearchQuery(data: IPublishedFileServiceQueryFilesRequestParams) {
    const modSearchQuery = useServerFn(api.steam.searchWorkshop);
    return useQuery({
        enabled: !!data.search_text && data.search_text.length > 3,
        queryKey: ['modsearch'],
        queryFn: () => modSearchQuery({ data })
    })
}


const modSearchStore = new Store({
    search_text: '',
    page: 1,
    numperpage: 10
})

export const useModSearch = () => {
    const store = useStore(modSearchStore);
    const query = useModSearchQuery(store);

    return {
        store,
        query
    }
}

export const search = (options: Partial<typeof modSearchStore['state']> = {}) => {
    modSearchStore.setState((state) => ({
        ...state,
        search_text: options.search_text ?? '',
        page: options.page ?? 1,
        numperpage: options.numperpage ?? 10,
    }))
}
export const resetSearch = () => {
    modSearchStore.setState((state) => ({
        search_text: '',
        page: 1,
        numperpage: 10
    }))
}
export const setPage = (page: number) => {
    modSearchStore.setState((state) => ({
        ...state,
        page,
    }))
}

export const setPageSize = (numperpage: number) => {
    modSearchStore.setState((state) => ({
        ...state,
        numperpage,
    }))
}
