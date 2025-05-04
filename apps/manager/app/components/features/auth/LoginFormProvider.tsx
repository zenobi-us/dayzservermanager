import { Form } from ':components/ui/form';

import { LoginFormContext } from './LoginFormContext';
import { useLoginForm } from './useLoginForm';

import type { LoginFormData } from './LoginFormSchema';
import type { PropsWithChildren } from 'react';

export function LoginFormProvider({
  onSubmit,
  children,
}: PropsWithChildren<{ onSubmit: (data: LoginFormData) => void }>) {
  const form = useLoginForm();
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <LoginFormContext.Provider value={form}>
      <Form {...form}>
        {}
        <form
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          {children}
        </form>
      </Form>
    </LoginFormContext.Provider>
  );
}
