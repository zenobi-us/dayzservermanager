import { useCanGoBack, useRouter } from '@tanstack/react-router';

export function NotFound() {
  const router = useRouter();
  const canGoback = useCanGoBack();

  return (
    <div className="grid min-h-full grid-cols-1 grid-rows-[1fr_auto_1fr] bg-background  lg:grid-cols-[max(50%,36rem)_1fr]">
      <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8"></header>
      <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
        <div className="max-w-lg">
          <p className="text-base/8 font-semibold text-muted-foreground">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-pretty text-secondary sm:text-6xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-primary sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          {canGoback && (
            <div className="mt-10">
              <a
                className="text-sm/7 font-semibold text-accent-foreground cursor-pointer hover:underline"
                onClick={() => {
                  router.history.back();
                }}
              >
                <span aria-hidden="true">&larr;</span> Go Back
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
