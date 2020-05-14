import {Request} from 'express';
import {Extractor} from './extractor';

/**
 * Returns a string extractor that retrieves the value for the header with the given name
 * from an express request.
 *
 * @param paramName The header name
 */
export function extractFromHeader(paramName: string): Extractor<string | undefined> {
    return (req: Request): string | undefined => {
        const value = req.header(paramName);
        if (value === null) {
            return undefined;
        }
        return value;
    };
}
