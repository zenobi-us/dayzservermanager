import { createContext, useContext } from 'react';

import type { useLoginForm } from './useLoginForm';

export const LoginFormContext = createContext<null | ReturnType<
  typeof useLoginForm
>>(null);
export const useLoginFormContext = () => {
  const context = useContext(LoginFormContext);
  if (!context) {
    throw new Error('LoginFormContext must be provided');
  }
  return context;
};
