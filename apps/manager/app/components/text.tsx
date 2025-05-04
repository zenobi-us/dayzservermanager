import { tv } from 'tailwind-variants';

import type { ComponentProps, PropsWithChildren } from 'react';

const variants = tv({
  base: 'text',
});

export function Text({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentProps<'span'>>) {
  const styles = variants({ className });

  return (
    <span className={styles} {...props}>
      {children}
    </span>
  );
}
