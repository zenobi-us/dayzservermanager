import { useRouterState } from '@tanstack/react-router';

export type IBreadcrumb = {
  id: string;
  name: string;
  path: string;
};

export function useBreadcrumbs() {
  const matches = useRouterState({
    select: (s) => {
      return s.matches;
    },
  });

  const withBreadcrumbs = matches.filter(
    (match): match is typeof match & { staticData: { breadcrumb: string } } => {
      return !!match.staticData?.breadcrumb;
    },
  );

  const output: IBreadcrumb[] = [];
  for (const match of withBreadcrumbs) {
    output.push({
      id: match.id,
      name: match.staticData.breadcrumb,
      path: match.pathname,
    });
  }

  return output;
}
