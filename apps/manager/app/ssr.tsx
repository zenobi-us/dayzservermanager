import {
    createStartHandler,
    defaultStreamHandler,
} from '@tanstack/react-start/server';
import { getRouterManifest } from '@tanstack/react-start/router-manifest';

import { createRouter } from './router';
import { registerGlobalMiddleware } from '@tanstack/react-start';
import { exceptionMiddleware } from './core/middleware/loggingMiddleware';


registerGlobalMiddleware({
    middleware: [exceptionMiddleware],
})

export default createStartHandler({
    createRouter,
    getRouterManifest,
})(defaultStreamHandler);
