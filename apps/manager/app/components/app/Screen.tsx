import type { PropsWithChildren } from 'react';

export function ScreenLayout({ children }: PropsWithChildren) {
  return (
    <html
      data-screen
      className="flex flex-col flex-grow min-h-full h-full w-full"
    >
      {children}
    </html>
  );
}
ScreenLayout.Body = ScreenLayoutBody;
function ScreenLayoutBody({ children }: PropsWithChildren) {
  return (
    <body className="flex flex-col flex-grow min-h-full w-full">
      {children}
    </body>
  );
}
