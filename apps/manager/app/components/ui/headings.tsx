import type { PropsWithChildren, ReactNode } from 'react';

export function SectionHeading({
  title,
  subtitle,
  children,
}: PropsWithChildren<{
  title: string;
  subtitle: ReactNode;
}>) {
  return (
    <div className="border-b border-border-accent-foreground pb-5 sm:flex sm:flex-grow sm:items-center sm:justify-between">
      <div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="mt-2 max-w-4xl text-sm text-secondary">{subtitle}</p>
      </div>
      {children && <div className="mt-3 sm:mt-0 sm:ml-4">{children}</div>}
    </div>
  );
}
