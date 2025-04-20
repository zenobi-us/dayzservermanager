import { createFetch } from '@vueuse/core';

import { config } from '&ui/config'
import { useAppStore } from '&ui/stores/app.js'

const store = useAppStore()

export const useGetAllModsQuery = createFetch({
    baseUrl: config.baseUrl + '/mods',
    fetchOptions: {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    options: {
        async afterFetch (response) {
            store.mods = response.data.mods
            return response
        }
    }
})
