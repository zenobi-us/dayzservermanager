import type { ReactNode } from 'react'
import {
    Outlet,
    createRootRouteWithContext,
    HeadContent,
    Scripts,
} from '@tanstack/react-router'

import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import appCss from "@/app.css?url"
import { FullScreenLoader } from '@/components/full-screen-loader'
import { QueryClient } from '@tanstack/react-query'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'TanStack Start Starter',
            },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
    }),
    pendingComponent: FullScreenLoader,
    component: RootComponent,
    context() {
        return {
        }
    }
})

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
            <TanStackRouterDevtools />
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <Scripts />
            </body>
        </html>
    )
}