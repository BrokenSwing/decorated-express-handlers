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

export function convertToBoolean(value: string): boolean | undefined {
    value = value.trim();
    if (value === '1' || value === 'true' || value === 'on') {
        return true;
    }
    if (value === '0' || value === 'false' || value === 'off') {
        return false;
    }
    return undefined;
}
