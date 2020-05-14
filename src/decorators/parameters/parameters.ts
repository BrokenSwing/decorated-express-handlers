import {addParameterInfoFor} from '../../metadata';

/**
 * Creates a parameter decorator with the given source.
 *
 * @param source The parameter source to specify in generated parameter info
 */
function createParamDecoratorFor(source: 'query' | 'header' | 'route' | 'body'): Function {
    return function(name: string): ParameterDecorator {
        return function (target: Record<string, unknown>, propertyKey: string | symbol, parameterIndex: number): void {
            addParameterInfoFor(target, propertyKey, {
                name,
                source: source,
                index: parameterIndex,
            });
        };
    };
}

/**
 * Links the decorated parameter to a query parameter.<br>
 * A query parameter is in the URL for GET request, after question mark.<br>
 * This decorator is meaningful only when used on a parameter of a class method that is decorated with
 * an handler decorator (@Get, @Post, @Put, etc ...).<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *          @Get('/')
 *          getUserById(@QueryParam('startsWith') nameBeginning: string): string {
 *              return ['George', 'John', 'Jack'].filter(n => n.startsWith(nameBeginning));
 *          }
 *
 *     }
 * </pre>
 *
 * A request to <code>/users/?startsWith=J</code> will return <em>['John', 'Jack']</em>.
 *
 * @param name The name of the query parameter to link to
 */
export const QueryParam = createParamDecoratorFor('query');

/**
 * Links the decorated parameter to a header value.<br>
 * A header value is a value that is sent in http header.<br>
 * This decorator is meaningful only when used on a parameter of a class method that is decorated with
 * an handler decorator (@Get, @Post, @Put, etc ...).<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *          @Get('/')
 *          getUsers(@HeaderParam('Content-Type') contentType: string): string {
 *              return `Asked for users list but displayed with format ${contentType}`;
 *          }
 *
 *     }
 * </pre>
 *
 * @param name The name of the header parameter to link to
 */
export const HeaderParam = createParamDecoratorFor('header');

/**
 * Links the decorated parameter to a route parameter.<br>
 * A route parameter is a parameter that is indicated in route path.<br>
 * This decorator is meaningful only when used on a parameter of a class method that is decorated with
 * an handler decorator (@Get, @Post, @Put, etc ...).<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *          @Get('/:id')
 *          getUserById(@QueryParam('id') userId: number): string {
 *              return `Asked for user with id ${userId}`;
 *          }
 *
 *     }
 * </pre>
 *
 * A request to <code>/users/5</code> will return <em>Asked for user with id 5</em>.
 *
 * @param name The name of the router parameter to link to
 */
export const RouteParam = createParamDecoratorFor('route');

/**
 * Links the decorated parameter to a body parameter.<br>
 * A body parameter is either in the URL for GET request, or in request body for POST request.<br>
 * This decorator is meaningful only when used on a parameter of a class method that is decorated with
 * an handler decorator (@Get, @Post, @Put, etc ...).<br>
 *
 * Example:
 * <pre>
 *     @Controller('/users')
 *     class UserController {
 *
 *          @Get('/')
 *          getUserById(@BodyParam('username') username: string, @BodyParam('password') password: string): string {
 *              // Create user
 *              return `User created: ${username}/${password}`;
 *          }
 *
 *     }
 * </pre>
 *
 * A POST request to <code>/users//code> with body <em>username=George&password=pass</em> will return
 * <em>User created: George/pass</em>.
 *
 * @param name The name of the body parameter to link to
 */
export const BodyParam = createParamDecoratorFor('body');
