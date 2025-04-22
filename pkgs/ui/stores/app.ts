import { defineStore } from 'pinia'

type AppState = {
    errorText: string
    modId: number
    modFile: string
    mods: { id: string; name: string }[],
    searchText: string;
    section: string;
}

export const useAppStore = defineStore<'app', AppState>('app', {
    state: () => ({
        errorText: '',
        modId: 0,
        modFile: '',
        mods: [],
        searchText: '',
        section: 'mods',
    })
})
