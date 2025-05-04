import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { tv } from 'tailwind-variants';

import { cn } from ':lib/utils/index';

import type { VariantProps } from 'tailwind-variants';

const variants = tv({
  base: 'relative w-full flex flex-grow overflow-hidden rounded-full',
  slots: {
    baseBg: 'bg-primary/20',
    progress: 'h-full w-full flex-1 transition-all',
    progressBg: 'bg-primary/40',
  },
  variants: {
    indeterminant: {
      true: {
        baseBg: [
          'border-2 border-gray-200',
          'progress-indeterminant-bubble progress-indeterminant-bubble-black dark:progress-indeterminant-bubble-white',
        ],
        progress: 'hidden',
      },
    },
  },
});
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof variants>) {
  const style = variants();
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-value={value}
      className={cn(style.base(props), style.baseBg(props), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(style.progress(props), style.progressBg(props))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
