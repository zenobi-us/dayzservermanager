import type { ServerConfigSchema } from './schema/serverSchema';
import type { z } from 'zod';

export class MissingServerDirectoryError extends Error {
  code = 'MissingServerDirectoryError';
}

export class ServerConfigInvalidError extends Error {
  code = 'ServerConfigInvalidError';
  constructor(public error: z.ZodError<typeof ServerConfigSchema>) {
    super('Server Config is invalid');
  }
}

export class ServerConfigParseError extends Error {
  code = 'ServerCOnfigParseError';

  constructor(error?: unknown) {
    super();
    if (!(error instanceof Error)) {
      return;
    }

    this.message = error.message;
    this.name = error.name;
    this.stack = error.stack;
    this.cause = error.cause;
  }
}

export class ServerFileNotFound extends Error {
  code = 'ServerFileNotFound';
  constructor(
    public serverId: string,
    public filename: string,
  ) {
    super(`Server[${serverId}] does not have file ${filename}`);
  }
}

export class NotServerModeError extends Error {
  code = 'NotServerModeError';
}
export class NotManagerModeError extends Error {
  code = 'NotManagerModeError';
}
export class NoModeError extends Error {
  code = 'NoModeError';
}
