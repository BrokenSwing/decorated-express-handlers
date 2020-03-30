import {Request} from 'express';
import {Extractor} from './extractor';

export function extractFromHeader(paramName: string): Extractor<string | undefined> {
    return (req: Request): string | undefined => {
        const value = req.header(paramName);
        if (value === null) {
            return undefined;
        }
        return value;
    };
}
