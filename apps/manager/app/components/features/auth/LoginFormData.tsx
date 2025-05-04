import { z } from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});
type LoginForm = typeof LoginFormSchema;
export type LoginFormData = z.infer<LoginForm>;
