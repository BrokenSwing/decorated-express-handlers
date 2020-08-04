import 'reflect-metadata';
import {NextFunction, Request, Response, Router} from 'express';
import {logger} from '../../logger';
import {
    getParameterInfoOf,
    getHandlerInfoOf,
    HttpVerb,
    isHandler,
    addControllerInfoFor,
    getParametersTypesOf
} from '../../metadata';
import { hasParser, getParserFor } from '../../registries/types-registry';

/**
 * Defines the decorated class as a controller. Every methods decorated with one of handlers
 * decorators (@Get, @Post, @Put, etc ...) in the controller will be treated as route handlers.
 *
 * Example:
 * <pre>
 *  @Controller('/users')
 *  public class UserController {
 *
 *      @Get('/')
 *      getAllUsers() {
 *          return ['Foo', 'Bar', 'Foobar'];
 *      }
 *
 *  }
 * </pre>
 */
export function Controller(basePath: string): Function {
    return function<T extends {new(...args: any[]): {}}>(constructor: T): T {
        // In futur, used parameters types to find dependencies
        /*
            Const result = Reflect.getOwnMetadata('design:paramtypes', constructor);
            console.log(constructor.name);
            console.log(result.map((t: any) => t.name));
         */

        /* Create router to attach handlers on */
        const router = Router();

        /* Create a wrapper for given type. In futur it will be populated with injected dependencies */
        const WrapperType = class extends constructor {
            router: Router = router;
        };

        addControllerInfoFor(WrapperType, {
            path: basePath,
            router,
        });

        /* Create an instance of wrapped type to make calls on */
        const instance = new WrapperType();

        /* Search for route handlers in the given type then attach them to previously created router */
        Object.getOwnPropertyNames(constructor.prototype)
            .filter((property) => isHandler(constructor.prototype, property))
            .forEach((property) => {

                /* Gather method data : handler decorators, method types and decorated parameters */
                const handlersInfo   = getHandlerInfoOf(constructor.prototype, property);
                const typesNames     = getParametersTypesOf(constructor.prototype, property);
                const parametersInfo = getParameterInfoOf(constructor.prototype, property);

                const extractors = parametersInfo
                    .map((param) => {
                        const typename = typesNames[param.index];
                        if (!hasParser(typename)) {
                            throw new Error(`Type ${typename} does not have a parser associated to it.`);
                        }
                        const parser = getParserFor(typename);
                        const extractor = getValue(param.name, param.source);

                        return (req: Request) => parser.parse(extractor(req), parser.defaultConfig);
                    });

                /* Create the method to extract all parameters from the request object */
                const parametersExtractor = (req: Request) => {
                    const values: any[] = [];
                    for (let i = 0; i < extractors.length; i++) {
                        const currentExtractor = extractors[i];
                        const parserResult = currentExtractor(req);
                        if (parserResult.success) {
                            values.push(parserResult.value);
                        } else {
                            return null;
                        }
                    }
                    return values;
                };

                const handleFunction = function(req: Request, res: Response, next: NextFunction): void {
                    const paramsValues: unknown[] | null = parametersExtractor(req);
                    if (paramsValues === null) {
                        next();
                    } else {
                        // TODO: Handle multiple return types
                        res.send(
                            (constructor.prototype[property] as Function).apply(instance, paramsValues)
                        );
                    }
                };

                handlersInfo.forEach((handler) => {
                    const routingMethod = getRouterMethodByHttpVerb(router, handler.method);

                    logger.debug(`Registering handler '${property}' on route '${handler.route}'` +
                        ` with method '${handler.method}'`);
                    routingMethod.call(router, handler.route, (req: Request, res: Response, next: NextFunction) =>
                        handleFunction(req, res, next));
                });
            });

        return WrapperType;
    };
}

function getValue(id: string | null, source: 'query' | 'route' | 'header' | 'body'): (req: Request) => any {
    switch (source) {
    case 'query':
        return getQueryValue(id);
    case 'body':
        return getBodyValue(id);
    case 'header':
        return getHeaderValue(id);
    case 'route':
        return getRouteValue(id);
    }   
}

function getQueryValue(id: string | null): (req: Request) => any {
    if (id === null) {
        return (req: Request) => req.query;
    }
    return (req: Request) => req.query[id];
}

function getRouteValue(id: string | null): (req: Request) => any {
    if (id === null)  {
        return (req: Request) => req.params;
    }
    return (req: Request) => req.params[id];
}

function getHeaderValue(id: string | null): (req: Request) => any {
    if (id === null) {
        throw new Error('You should provide an identifier for a header value.');
    }
    return (req: Request) => req.header(id);
}

function getBodyValue(id: string | null): (req: Request) => any {
    if (id === null) {
        return (req: Request) => req.body || {};
    }
    return (req: Request) => (req.body || {})[id];
}

/**
 * Returns the appropriate method of the given router to register a route handler
 * that handle the give http verb.
 *
 * @param router The router to get method of
 * @param verb The verb matching http method to handle
 */
function getRouterMethodByHttpVerb(router: Router, verb: HttpVerb): Function {
    switch (verb) {
    case 'get':
        return router.get;
    case 'post':
        return router.post;
    case 'delete':
        return router.delete;
    case 'put':
        return router.put;
    case 'patch':
        return router.patch;
    }
}
