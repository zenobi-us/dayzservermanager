import { ServerConfigSchema } from "./serverSchema";
import { z } from 'zod';

export class MissingServerDirectoryError extends Error { }

export class ServerConfigInvalidError extends Error {
    constructor(public error: z.ZodError<typeof ServerConfigSchema>) {
        super('Server Config is invalid')
    }
}

export class ServerConfigParseError extends Error {
    constructor(error?: unknown) {
        super()
        if (!(error instanceof Error)) { return }

        this.message = error.message;
        this.name = error.name;
        this.stack = error.stack;
        this.cause = error.cause;
    }
}

export class ServerFileNotFound extends Error {
    constructor(
        public serverId: string,
        public filename: string
    ) {
        super(`Server[${serverId}] does not have file ${filename}`)
    }
}

export class NotServerModeError extends Error { }
export class NotManagerModeError extends Error { }
export class NoModeError extends Error { }