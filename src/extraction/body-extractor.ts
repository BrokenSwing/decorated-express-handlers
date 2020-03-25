import {Request} from 'express';
import {Extractor} from './extractor';

export function extractFromBody(paramName: string): Extractor<string | undefined> {
    return (req: Request): string | undefined => {
        return req.body[paramName];
    };
}
