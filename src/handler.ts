import {Request, Response, NextFunction} from 'express';
import 'reflect-metadata';
import {logger} from './logger';
import {convertToInteger} from './conversion/convert';
import {ParameterInfo, PARAM_INFO_METADATA} from './metadata/parameter-info';
import {Extractor, extractFromBody, extractFromRoute} from './extraction';

export function Handler(): Function {
    return function (
        target: Record<string, unknown>,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void
    {

        /* Getting parameters types */
        const typesNames: string[] = Reflect
            .getMetadata('design:paramtypes', target, propertyKey)
            .map((t: Record<string, unknown>) => t.name);

        /* Getting decorated parameters */
        const decoratedParameters: ParameterInfo[] = Reflect.getOwnMetadata(PARAM_INFO_METADATA, target, propertyKey);

        /* All parameters should be decorated */
        if (typesNames.length !== decoratedParameters.length) {
            logger.error(`All parameters of handler must be decorated. Expected ${typesNames.length}` +
            ` parameters to be decorated, got ${decoratedParameters.length} parameters decorated.`);
            process.exit(1);
        }

        const extractors: Extractor<unknown>[] = [];

        for (const decorated of decoratedParameters) {
            const typeName = typesNames[decorated.index];
            logger.debug(`Preparing extractor for '${decorated.name}' parameter of type ${typeName}` +
                ` for handler '${propertyKey}'`);

            let converter: Function;

            if (typeName === 'Number') {
                converter = convertToInteger;
            } else {
                logger.error(`Unknown type : ${typeName}`);
                process.exit(1);
            }

            switch (decorated.source) {
            case 'route':
                extractors[decorated.index] = <T>(req: Request): T | undefined => {
                    const value: string | undefined = extractFromRoute(decorated.name)(req);
                    if (value === undefined) {
                        return undefined;
                    } else {
                        return converter(value) as T;
                    }
                };
                break;
            case 'body':
                extractors[decorated.index] = <T>(req: Request): T | undefined => {
                    const value: string | undefined = extractFromBody(decorated.name)(req);
                    if (value === undefined) {
                        return undefined;
                    } else {
                        return converter(value) as T;
                    }
                };
                break;
            }

        }

        /* Keeping original function to call it later */
        const originalFunc: Function | undefined = descriptor.value;

        descriptor.value = (req: Request, res: Response, next: NextFunction): void => {
            const extractedValues: unknown[] = [];
            let i = 0;
            while (i < extractors.length) {
                extractedValues[i] = extractors[i](req);
                if (extractedValues[i] === undefined) {
                    next();
                    break;
                }
                i++;
            }
            if (i === extractors.length && originalFunc !== undefined) {
                res.send(originalFunc.call(target, extractedValues));
            }
        };
    };
}
