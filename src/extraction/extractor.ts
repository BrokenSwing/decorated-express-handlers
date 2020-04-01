import {Request} from 'express';
import {ParameterInfo} from '../metadata/parameter-info';
import {logger} from '../logger';
import {guard, pipe, UnaryFunction} from '../utils/pipe';
import {convertToBoolean, convertToInteger, convertToString} from '../conversion/convert';
import {extractFromRoute} from './route-extractor';
import {extractFromBody} from './body-extractor';
import {extractFromHeader} from './header-extractor';

export interface Extractor<T> {
    (req: Request): T | undefined;
}

export function createParamsExtractionMethod(parametersTypes: string[], parametersInfo: ParameterInfo[]): Extractor<unknown[] | undefined> {
    /* Check if all method parameters are decorated */
    if (parametersTypes.length !== parametersInfo.length) {
        logger.error(`All parameters of handler must be decorated. Expected ${parametersTypes.length}` +
            ` parameters to be decorated, got ${parametersInfo.length} parameters decorated.`);
        process.exit(1);
    }

    const extractors: Extractor<unknown>[] = [];

    for (const decorated of parametersInfo) {
        const typeName = parametersTypes[decorated.index];

        let converter: UnaryFunction<string, unknown>;

        // TODO: Move this logic elsewhere
        if (typeName === 'Number') {
            converter = convertToInteger;
        } else if (typeName === 'String') {
            converter = convertToString;
        } else if (typeName === 'Boolean') {
            converter = convertToBoolean;
        } else {
            logger.error(`Unknown type : ${typeName}`);
            process.exit(1);
        }

        let extractor: UnaryFunction<Request, string | undefined>;

        // TODO: Move this logic elsewhere ?
        switch (decorated.source) {
        case 'route':
            extractor = extractFromRoute(decorated.name);
            break;
        case 'body':
            extractor = extractFromBody(decorated.name);
            break;
        case 'header':
            extractor = extractFromHeader(decorated.name);
            break;
        }

        extractors[decorated.index] = pipe(
            extractor,
            guard((s: string) => s !== undefined),
            converter
        );

    }
    return function(req: Request): unknown[] | undefined {
        const extractedValues: unknown[] = [];
        let i = 0;
        while (i < extractors.length) {
            extractedValues[i] = extractors[i](req);
            if (extractedValues[i] === undefined) {
                break;
            }
            i++;
        }
        if (i === extractors.length) {
            return extractedValues;
        } else {
            return undefined;
        }
    };
}
