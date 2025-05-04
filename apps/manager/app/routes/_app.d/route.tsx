import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';

import { AppLayout } from '@/components/app/AppLayout';
import { Container } from '@/components/container';
import { useLoginApi } from '@/components/features/auth/useLoginApi';
import { SiteHeader } from '@/components/site-header';
import { Progress } from '@/components/ui/progress';
import { isErrorResponse } from '@/types/response';

export const Route = createFileRoute('/_app/d')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'Home',
  },
});

function RouteComponent() {
  const loginApi = useLoginApi();

  const isError = useMemo(() => {
    return isErrorResponse(loginApi.userQuery.data);
  }, [loginApi.userQuery.data]);

  useEffect(() => {
    if (loginApi.userQuery.isPending) {
      return;
    }

    if (isError) {
      return;
    }

    if (!loginApi.isAuthenticated) {
      return;
    }
  }, [loginApi.userQuery.data]);

  return (
    <AppLayout>
      <AppLayout.Main>
        {!isError && loginApi.userQuery.isPending && (
          <Container className="max-w-44 p-8 flex flex-grow items-center justify-center ">
            <Progress className="h-4" indeterminant />
          </Container>
        )}
        {!isError && !loginApi.userQuery.isPending && (
          <>
            <SiteHeader />
            <Outlet />
          </>
        )}
      </AppLayout.Main>
    </AppLayout>
  );
}
