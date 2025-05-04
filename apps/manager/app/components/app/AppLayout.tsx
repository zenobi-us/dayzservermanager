import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col flex-grow min-h-full w-full">{children}</div>
  );
}

AppLayout.Header = Header;
AppLayout.Main = Main;
AppLayout.Footer = Footer;

function Main({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col flex-grow gap-2 w-full">{children}</main>
  );
}

function Header({ children }: PropsWithChildren) {
  return <header>{children}</header>;
}

function Footer({ children }: PropsWithChildren) {
  return <footer>{children}</footer>;
}
