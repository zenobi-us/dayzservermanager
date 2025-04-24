import { z } from "zod";

const ServerConfigBooleanEnum = z.union([z.literal(0), z.literal(1), z.literal(2)]);

export const ServerConfigSchema = z.object({
    maxPlayers: z.number().default(60),
    verifySignatures: ServerConfigBooleanEnum.default(1),
    forceSameBuild: ServerConfigBooleanEnum.default(0),
    disableVoN: ServerConfigBooleanEnum.default(1),
    disable3rdPerson: ServerConfigBooleanEnum.default(1),
    serverTime: z.string(),
    serverTimePersistent: ServerConfigBooleanEnum.default(1),
    guaranteedUpdates: ServerConfigBooleanEnum.default(1),
    loginQueueConcurrentPlayers: z.number().default(5),
    instanceId: z.number(),
    respawnTime: z.number().default(0),
    timeStampFormat: z.union([z.literal('Short'), z.literal('Long')]),
    adminLogPlayerHitsOnly: ServerConfigBooleanEnum.default(0),
    enableDebugMonitor: ServerConfigBooleanEnum.default(0),
    steamQueryPort: z.number().default(27016),
    allowFilePatching: ServerConfigBooleanEnum.default(1),
    simulatedPlayersBatch: z.number().default(20),
    multithreadedReplication: ServerConfigBooleanEnum.default(0),
    speedhackDetection: ServerConfigBooleanEnum.default(1),
    networkRangeClose: z.number().default(20),
    defaultVisibility: z.number().default(1375),
    lightingConfig: ServerConfigBooleanEnum.default(1),
    disableBaseDamage: ServerConfigBooleanEnum.default(0),
    lootHistory: ServerConfigBooleanEnum.default(1),
    enableCfgGameplayFile: ServerConfigBooleanEnum.default(1),
    vppDisablePassword: ServerConfigBooleanEnum.default(0),
    template: z.string(),
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>;
