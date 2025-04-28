import { z } from 'zod';

export const LoginParametersSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type LoginParameters = z.infer<typeof LoginParametersSchema>;
