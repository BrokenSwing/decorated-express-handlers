export function convertToInteger(value: string): number | undefined {
    const result = parseInt(value, 10);
    if (isNaN(result)) {
        return undefined;
    }
    return result;
}

export function convertToString(value: string): string {
    return value.trim();
}
