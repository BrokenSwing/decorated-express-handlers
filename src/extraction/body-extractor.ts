import {Request} from 'express';
import {Extractor} from './extractor';

/**
 * Returns a string extractor that retrieves the value for the body parameter with the given name
 * from an express request.
 *
 * @param paramName The parameter name
 */
export function extractFromBody(paramName: string): Extractor<string | undefined> {
    return (req: Request): string | undefined => {
        return req.body[paramName]; // TODO: Check type
    };
}
