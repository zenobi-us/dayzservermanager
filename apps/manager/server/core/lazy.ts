import { RequestHandler } from "express";
import viteDevServer from "vavite/vite-dev-server";

// This is an optional optimization to load routes lazily so that
// when reloadOn option is set to "static-deps-change",
// changes to the route handlers will not trigger a reload.
export function lazy(
	importer: () => Promise<{ default: RequestHandler }>,
): RequestHandler {
	return async (req, res, next) => {
		try {
			const routeHandler = (await importer()).default;
			routeHandler(req, res, next);
		} catch (err) {
			if (err instanceof Error) viteDevServer?.ssrFixStacktrace(err);
			next(err);
		}
	};
}