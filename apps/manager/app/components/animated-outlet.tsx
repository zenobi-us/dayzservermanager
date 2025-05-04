import { getRouterContext, Outlet } from '@tanstack/react-router';
import { motion, useIsPresent } from 'framer-motion';
import { cloneDeep } from 'lodash-es';
import { forwardRef, useContext, useRef } from 'react';

import type { ComponentPropsWithoutRef } from 'react';

export const createAnimatedOutlet = (
  transitionProps: ComponentPropsWithoutRef<typeof motion.div>,
) => {
  return forwardRef<HTMLDivElement>((_, ref) => {
    const RouterContext = getRouterContext();

    const routerContext = useContext(RouterContext);

    const renderedContext = useRef(routerContext);

    const isPresent = useIsPresent();

    if (isPresent) {
      renderedContext.current = cloneDeep(routerContext);
    }

    return (
      <motion.div ref={ref} {...transitionProps}>
        <RouterContext.Provider value={renderedContext.current}>
          <Outlet />
        </RouterContext.Provider>
      </motion.div>
    );
  });
};
