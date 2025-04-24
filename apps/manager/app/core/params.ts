export function UrlSearchParamsFromObject(obj: object) {
    const params = Object.fromEntries(Object.entries(obj).map(([key, value]) => [key.toString(), value.toString()]))
    return new URLSearchParams(params);
}
