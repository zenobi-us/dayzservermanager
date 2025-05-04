import { LoaderCircle, Text } from 'lucide-react';

import { Button } from ':components/ui/button';

import { LoginFormFields } from './LoginFormFields';
import { LoginFormProvider } from './LoginFormProvider';

import type { LoginFormData } from './LoginFormSchema';

export function LoginForm({
  isSending,
  onSubmit,
}: {
  isSending?: boolean;
  onSubmit: (data: LoginFormData) => void;
}) {
  return (
    <LoginFormProvider onSubmit={onSubmit}>
      <div className="flex flex-col items-center gap-2">
        <LoginFormFields />
        <Button type="submit" disabled={isSending}>
          {isSending && <LoaderCircle className="animate-spin" />}
          <Text>Login</Text>
        </Button>
      </div>
    </LoginFormProvider>
  );
}
