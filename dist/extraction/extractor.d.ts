import { Request } from 'express';
export interface Extractor<T> {
    (req: Request): T | undefined;
}
