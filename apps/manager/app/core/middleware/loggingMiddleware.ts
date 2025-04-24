import { createMiddleware } from "@tanstack/react-start"

export const exceptionMiddleware = createMiddleware().server(({ next }) => {
    try {
        return next()
    } catch (error) {
        console.error(error)
        throw error
    }
})
