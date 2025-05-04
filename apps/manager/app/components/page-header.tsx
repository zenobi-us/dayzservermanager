import { Container } from './container';

import type { PropsWithChildren, ReactNode } from 'react';

export function PageHeader({
  title,
  actions,
  children,
}: PropsWithChildren<{
  title: string;
  actions?: ReactNode;
}>) {
  return (
    <Container className="flex-col gap-4">
      <div className="flex gap-4 justify-start items-center">
        <h1 className="text-4xl text-accent-foreground">{title}</h1>
        {actions}
      </div>
      {children}
      <hr />
    </Container>
  );
}
