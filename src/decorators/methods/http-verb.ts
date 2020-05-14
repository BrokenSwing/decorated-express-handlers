import 'reflect-metadata';
import {
    addHandlerInfoFor,
    HttpVerb,
} from '../../metadata';

export interface HandlerDecorator {
    (route: string): Function;
}

/**
 * Creates an handler decorator that specifies the given verb in the handler information.
 *
 * @param verb The http verb for the created decorator
 */
function createDecoratorForVerb(verb: HttpVerb): HandlerDecorator {
    return function(route: string): Function {
        return function (target: Record<string, unknown>, propertyKey: string): void {
            addHandlerInfoFor(target, propertyKey, {
                method: verb,
                route,
            });
        };
    };
}

/**
 * Defines a class method as a GET request handler for the given route.<br>
 * This decorator is meaningless if the class it belongs to isn't a controller.<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *         @Get('/')
 *         listUsers() {
 *             return ['John', 'Jerry', 'Bryan'];
 *         }
 *
 *     }
 * </pre>
 *
 * In the above example, the <em>listUsers</em> method will be called on GET requests on <em>/users/</em>.
 *
 * @param route The route this handler must handle
 */
export const Get = createDecoratorForVerb('get');

/**
 * Defines a class method as a POST request handler for the given route.<br>
 * This decorator is meaningless if the class it belongs to isn't a controller.<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *         @Post('/')
 *         createUser(@QueryParam('username') username: string, @QueryParam('password') password: string): string {
 *             // Create user ...
 *             return `User with name ${username} and password ${password} created.`;
 *         }
 *
 *     }
 * </pre>
 *
 * In the above example, the <em>createUser</em> method will be called on POST requests on <em>/users/</em>.
 *
 * @param route The route this handler must handle
 */
export const Post = createDecoratorForVerb('post');

/**
 * Defines a class method as a DELETE request handler for the given route.<br>
 * This decorator is meaningless if the class it belongs to isn't a controller.<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *         @Delete('/:id')
 *         deleteUser(@RouteParam('id') userId: number): string {
 *             // Delete user ...
 *             return `User with id ${userId} deleted.`;
 *         }
 *
 *     }
 * </pre>
 *
 * In the above example, the <em>deleteUser</em> method will be called on DELETE requests on <em>/users/:id</em>.
 *
 * @param route The route this handler must handle
 */
export const Delete = createDecoratorForVerb('delete');

/**
 * Defines a class method as a PATCH request handler for the given route.<br>
 * This decorator is meaningless if the class it belongs to isn't a controller.<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *         @Patch('/:id')
 *         changeUsername(@RouteParam('id') userId: number, @QueryParam('username') newUsername: string): string {
 *             // Change user's username ...
 *             return `Username of user with id ${userId} is now ${newUsername}`;
 *         }
 *
 *     }
 * </pre>
 *
 * In the above example, the <em>changeUsername</em> method will be called on PATCH requests on <em>/users/:id</em>.
 *
 * @param route The route this handler must handle
 */
export const Patch = createDecoratorForVerb('patch');

/**
 * Defines a class method as a PUT request handler for the given route.<br>
 * This decorator is meaningless if the class it belongs to isn't a controller.<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *         @Put('/:id')
 *         changeUsername(
 *             @RouteParam('id') userId: number,
 *             @QueryParam('username') username: string,
 *             @QueryParameter('password') password: string
 *         ): string {
 *             // Create the user ...
 *             return `User with id ${userId}, username ${username}, password ${password} created.`;
 *         }
 *
 *     }
 * </pre>
 *
 * In the above example, the <em>changeUsername</em> method will be called on PUT requests on <em>/users/:id</em>.
 *
 * @param route The route this handler must handle
 */
export const Put = createDecoratorForVerb('put');
