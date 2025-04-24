import { useRouterState } from '@tanstack/react-router';

export type IBreadcrumb = {
  id: string;
  name: string;
  path: string;
};

export function useBreadcrumbs() {
  const matches = useRouterState({ select: (s) => s.matches });

  const breadcrumbs = matches
    .filter(({ staticData }) => staticData.breadcrumb)
    .reduce((results, match) => {
      return {
        ...results,
        [match.id]: {
          id: match.id,
          name: match.staticData.breadcrumb,
          path: match.pathname,
        },
      };
    }, {});

  return Object.values(breadcrumbs) as IBreadcrumb[];
}
