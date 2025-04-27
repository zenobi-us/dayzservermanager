import { z } from 'zod';

export const AppStatusSchema = z.object({
  appid: z.string(),
  installed: z.boolean(),
  version: z.string(),
});

export type AppStatus = z.infer<typeof AppStatusSchema>;
