import {Request} from 'express';
import {Extractor} from './extractor';

export function extractFromRoute<T>(paramName: string): Extractor<string | undefined> {
    return (req: Request): string | undefined => {
        return req.params[paramName];
    };
}
