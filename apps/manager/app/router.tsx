import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query'
import { ErrorBoundary } from './components/error-boundary';
import { NotFound } from './components/not-found';
import { queryClient } from './core/api/client';

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultErrorComponent: ErrorBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  })


  return routerWithQueryClient(
    router,
    queryClient,
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

