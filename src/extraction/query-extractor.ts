import {Request} from 'express';
import {Extractor} from './extractor';

/**
 * Returns a string extractor that retrieves the value for the query parameter with the given name
 * from an express request.
 *
 * @param paramName The parameter name
 */
export function extractFromQuery(paramName: string): Extractor<string | undefined> {
    return (req: Request): string | undefined => {
        const value = req.query[paramName];
        if (typeof value === 'string') {
            return value;
        }
        return undefined;
    };
}
