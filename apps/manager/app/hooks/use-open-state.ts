import { useStore, Store } from '@tanstack/react-store'

export function createOpenState<T>(data: T) {
    const store = new Store(data);

    const open = (key: keyof typeof store['state']) => {
        store.setState((state) => ({ ...state, [key]: true }))
    }
    const close = (key: keyof typeof store['state']) => {
        store.setState((state) => ({ ...state, [key]: false }))
    }
    const useIsOpen = (key: keyof typeof store['state']) => {
        return useStore(store, (state) => state[key])
    }

    return {
        open, close, useIsOpen
    }

}