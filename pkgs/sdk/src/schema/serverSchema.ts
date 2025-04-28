import { z } from 'zod';

import { ModItemListSchema } from './modsSchema';

import type { ContainerInfo } from 'dockerode';

const ServerConfigBooleanEnum = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
]);

export const ServerConfigSchema = z.object({
  adminLogPlayerHitsOnly: ServerConfigBooleanEnum.default(0),
  allowFilePatching: ServerConfigBooleanEnum.default(1),
  defaultVisibility: z.number().default(1375),
  disable3rdPerson: ServerConfigBooleanEnum.default(1),
  disableBaseDamage: ServerConfigBooleanEnum.default(0),
  disableVoN: ServerConfigBooleanEnum.default(1),
  enableCfgGameplayFile: ServerConfigBooleanEnum.default(1),
  enableDebugMonitor: ServerConfigBooleanEnum.default(0),
  forceSameBuild: ServerConfigBooleanEnum.default(0),
  guaranteedUpdates: ServerConfigBooleanEnum.default(1),
  hostname: z.string(),
  instanceId: z.number(),
  lightingConfig: ServerConfigBooleanEnum.default(1),
  loginQueueConcurrentPlayers: z.number().default(5),
  lootHistory: ServerConfigBooleanEnum.default(1),
  maxPlayers: z.number().default(60),
  multithreadedReplication: ServerConfigBooleanEnum.default(0),
  networkRangeClose: z.number().default(20),
  respawnTime: z.number().default(0),
  serverTime: z.string(),
  serverTimePersistent: ServerConfigBooleanEnum.default(1),
  simulatedPlayersBatch: z.number().default(20),
  speedhackDetection: ServerConfigBooleanEnum.default(1),
  steamQueryPort: z.number().default(27016),
  template: z.string(),
  timeStampFormat: z.union([z.literal('Short'), z.literal('Long')]),
  verifySignatures: ServerConfigBooleanEnum.default(1),
  vppDisablePassword: ServerConfigBooleanEnum.default(0),
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>;

export const CreateServerPayloadSchema = ServerConfigSchema.pick({
  hostname: true,
}).and(
  ServerConfigSchema.omit({
    hostname: true,
  }).partial(),
);

export const CreateServerContainerPayloadSchema = z.object({
  serverId: z.string(),
});
export type CreateServerContainerPayload = z.infer<
  typeof CreateServerContainerPayloadSchema
>;

export type CreateServerPayload = z.infer<typeof CreateServerPayloadSchema>;

export const ServerBaseSchema = z.object({
  id: z.string(),
  path: z.string(),
});

export type ServerBase = z.infer<typeof ServerBaseSchema>;

export const ServerWithDetailsSchema = z.object({
  map: z.string(),
  mods: ModItemListSchema,
  config: z.object({
    // Add your ServerConfig schema here if you have one defined
  }),
  error: z.null(),
});

export type ServerWithDetails = z.infer<typeof ServerWithDetailsSchema>;

export const ServerWithGenericErrorSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
});

export type ServerWithGenericError = z.infer<
  typeof ServerWithGenericErrorSchema
>;

export const ServerWithParseErrorSchema = z.object({
  error: z.object({
    code: z.literal('ServerWithParseErrorSchema'),
  }),
});

export const ServerWithInvalidConfigSchema = z.object({
  error: z.object({
    code: z.literal('ServerWithInvalidConfigSchema'),
  }),
});

export const ServerSchema = ServerBaseSchema.and(
  z.union([
    ServerWithParseErrorSchema,
    ServerWithInvalidConfigSchema,
    ServerWithDetailsSchema,
    ServerWithGenericErrorSchema,
  ]),
);
export type Server = z.infer<typeof ServerSchema> & {
  container?: ContainerInfo;
};

export enum ServerExistanceStatus {
  Creating = 'creating',
  DoesNotExist = 'doesNotExist',
  Exists = 'exists',
  Unknown = 'unknown',
}

export const GetServerDetailParamsSchema = z.object({
  serverId: z.string(),
});
export type GetServerDetailParams = z.infer<typeof GetServerDetailParamsSchema>;
