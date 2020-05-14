/**
 * Converts the given value to an integer. If the given value isn't an integer, the returned value is undefined.
 *
 * @param value The value to convert to integer
 */
export function convertToInteger(value: string): number | undefined {
    const result = parseInt(value, 10);
    if (isNaN(result)) {
        return undefined;
    }
    return result;
}

/**
 * Converts the given value to a string. The conversion does trim the given value.
 *
 * @param value The value to convert to a trimmed string
 */
export function convertToString(value: string): string {
    return value.trim();
}

/**
 * Converts the given value to a boolean. If the given value can't be interpreted as a boolean,
 * the returned value is undefined.<br>
 *
 * Here is a table listing all valid values that can be interpreted as a boolean :
 * <table>
 *     <tr><th>Interpreted as false</th><th>Interpreted as true</th></tr>
 *     <tr><td>'0'</td><td>'1'</td></tr>
 *     <tr><td>'false'</td><td>'true'</td></tr>
 *     <tr><td>'off'</td><td>'on'</td></tr>
 * </table>
 *
 * @param value The value to convert to a boolean
 */
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
