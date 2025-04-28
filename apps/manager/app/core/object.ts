export function typedEntries<T extends Record<string, any>>(
  obj: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function typedValues<T extends Record<string, any>>(
  obj: T,
): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

export function typedKeys<T extends Record<string, any>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function typedFromEntries<T extends Record<string, any>>(
  entries: [keyof T, T[keyof T]][],
): T {
  return Object.fromEntries(entries) as T;
}

export function typedAssign<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  return Object.assign(target, ...sources) as T;
}
