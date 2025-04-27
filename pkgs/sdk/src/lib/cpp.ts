import type { SafeParseReturnType, z, ZodSchema } from 'zod';

// https://regex101.com/r/oWAQ2H/1
const ConfigParameterPattern =
  /^(?!\/\/)\s*(?<key>\w+)\s*=\s*(?<value>[^;]*);/gm;

export function createCppFileParser<T extends ZodSchema>(schema: T) {
  return (contents: string) => {
    let match;
    const data: Record<string, any> = {};

    while ((match = ConfigParameterPattern.exec(contents)) !== null) {
      if (!match.groups) {
        continue;
      }
      const key = match.groups.key;
      const value = JSON.parse(match.groups.value.trim());

      data[key] = value;
    }

    return schema.safeParseAsync(data) as Promise<
      SafeParseReturnType<T, z.infer<T>>
    >;
  };
}
