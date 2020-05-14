import 'reflect-metadata';
import {NextFunction, Request, Response, Router} from 'express';
import {logger} from '../../logger';
import {createParamsExtractionMethod} from '../../extraction';
import {
    getParameterInfoOf,
    getHandlerInfoOf,
    HttpVerb,
    isHandler,
    addControllerInfoFor,
    getParametersTypesOf
} from '../../metadata';

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

                /* Create the method to extract all parameters from the request object */
                const parametersExtractor = createParamsExtractionMethod(typesNames, parametersInfo);
                const handleFunction = function(req: Request, res: Response, next: NextFunction): void {
                    const paramsValues: unknown[] | undefined = parametersExtractor(req);
                    if (paramsValues === undefined) {
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
