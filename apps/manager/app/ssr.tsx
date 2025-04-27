import { registerGlobalMiddleware } from '@tanstack/react-start';
import { getRouterManifest } from '@tanstack/react-start/router-manifest';
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';

import { exceptionMiddleware } from './core/middleware/loggingMiddleware';
import { createRouter } from './router';

registerGlobalMiddleware({
  middleware: [exceptionMiddleware],
});

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
