import { createContext, useContext, useEffect, useState } from 'react';

import { Drawer, DrawerContent } from './ui/drawer';

import type { ComponentProps, PropsWithChildren } from 'react';

const DrawerControllerContext = createContext<null | { isOpen?: boolean }>(
  null,
);

export function DrawerController({
  children,
  isOpen,
}: PropsWithChildren<{ isOpen?: boolean }>) {
  const [open, setOpen] = useState(!!isOpen);

  useEffect(() => {
    setOpen(!!isOpen);
  }, [isOpen]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerControllerContext.Provider value={{ isOpen: open }}>
        {children}
      </DrawerControllerContext.Provider>
    </Drawer>
  );
}

export function useDrawerController() {
  const context = useContext(DrawerControllerContext);
  if (!context) {
    throw new Error(
      'useDrawerController can only be used within DrawerController',
    );
  }
  return context;
}

export function DrawerControllerContent({
  children,
  ...props
}: ComponentProps<typeof DrawerContent>) {
  const drawer = useDrawerController();

  if (!drawer.isOpen) {
    return null;
  }

  return <DrawerContent {...props}>{children}</DrawerContent>;
}
