import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type LoginFormData, LoginFormSchema } from './LoginFormData';

export function useLoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  return form;
}
