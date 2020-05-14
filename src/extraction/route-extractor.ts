import {Request} from 'express';
import {Extractor} from './extractor';

/**
 * Returns a string extractor that retrieves the route parameter with the given name
 * from an express request.
 *
 * @param paramName The route parameter name
 */
export function extractFromRoute<T>(paramName: string): Extractor<string | undefined> {
    return (req: Request): string | undefined => {
        return req.params[paramName];
    };
}
