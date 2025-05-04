import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

import { LoginFormFields } from './LoginFormFields';
import { LoginFormProvider } from './LoginFormProvider';

import type { LoginFormData } from './LoginFormData';
import type { PropsWithChildren } from 'react';

export function LoginDrawer({
  onSubmit,
  children,
}: PropsWithChildren<{
  onSubmit: (data: LoginFormData) => void;
}>) {
  return (
    <Drawer direction="top">
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className={cn('w-2xl m-auto', 'border-t-0 shadow-lg')}>
        <div className="p-4 bg-white rounded-t-[10px] flex-1">
          <LoginFormProvider onSubmit={onSubmit}>
            <DrawerHeader>Login</DrawerHeader>
            <div className="flex flex-grow">
              <LoginFormFields />
            </div>
            <DrawerFooter>
              <Button type="submit">Login</Button>
            </DrawerFooter>
          </LoginFormProvider>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
