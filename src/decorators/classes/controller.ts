import 'reflect-metadata';
import {HandlerInfo, PROPERTY_INFO_METADATA} from '../../metadata/handler-info';
import {NextFunction, Router, Request, Response} from 'express';
import {logger} from '../../logger';
import {createParamsExtractionMethod} from '../../extraction';
import {PARAM_INFO_METADATA, ParameterInfo} from '../../metadata/parameter-info';

export function Controller(): Function {
    return function<T extends {new(...args: any[]): {}}>(constructor: T): T {
        // Const result = Reflect.getOwnMetadata('design:paramtypes', constructor);
        // Console.log(constructor.name);
        // Console.log(result.map((t: any) => t.name));

        const router = Router();
        const NewType = class extends constructor {
            router: Router = router;
            s = 'My string'
        };
        const instance = new NewType();

        for (const propertyKey of Object.keys(constructor.prototype)) {
            const handlersInfo: HandlerInfo[] = Reflect.getOwnMetadata(PROPERTY_INFO_METADATA, constructor.prototype, propertyKey);
            if (handlersInfo && handlersInfo.length > 0) {
                const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, propertyKey);
                if (descriptor !== undefined) {

                    const typesNames: string[] = Reflect
                        .getMetadata('design:paramtypes', constructor.prototype, propertyKey)
                        .map((t: Record<string, unknown>) => t.name);
                    const parametersInfo: ParameterInfo[] = Reflect.getOwnMetadata(PARAM_INFO_METADATA, constructor.prototype, propertyKey) || [];

                    const parametersExtractor = createParamsExtractionMethod(typesNames, parametersInfo);
                    const toCall = function(req: Request, res: Response, next: NextFunction): void {
                        const paramsValues: unknown[] | undefined = parametersExtractor(req);
                        if (paramsValues === undefined) {
                            next();
                        } else {
                            res.send(
                                (constructor.prototype[propertyKey] as Function).apply(instance, paramsValues)
                            );
                        }
                    };

                    for (const handlerInfo of handlersInfo) {
                        let routingMethod: Function | undefined;
                        switch (handlerInfo.method) {
                        case 'get':
                            routingMethod = router.get;
                            break;
                        case 'post':
                            routingMethod = router.post;
                            break;
                        case 'delete':
                            routingMethod = router.delete;
                            break;
                        case 'put':
                            routingMethod = router.put;
                            break;
                        case 'patch':
                            routingMethod = router.patch;
                            break;
                        default:
                            routingMethod = undefined;
                        }
                        logger.debug(`Registering handler '${propertyKey}' on route '${handlerInfo.route}'` +
                        ` with method '${handlerInfo.method}'`);
                        routingMethod?.call(router, handlerInfo.route, (req: Request, res: Response, next: NextFunction) =>
                            toCall(req, res, next));
                    }
                }
            }
        }

        return NewType;
    };
}
