import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { FullScreenLoader } from '@/components/full-screen-loader';

import type { AuthStore } from '@/core/store/AuthStore';
import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import appCss from '@/app.css?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  AuthStore: typeof AuthStore;
}>()({
  context() {
    return {};
  },
  pendingComponent: FullScreenLoader,
  component: RootComponent,
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
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </RootDocument>
  );
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
  );
}
