import 'reflect-metadata';

/**
 * The metadata key for handler information.
 */
export const PROPERTY_INFO_METADATA = Symbol('handlerInfo');

/**
 * Information about request handler.
 * Attributes:
 *  - method: the http verb to accept
 *  - route: the route to receive requests from
 */
export interface HandlerInfo {
    method: HttpVerb;
    route: string;
}

/**
 * All allowed http verbs.
 */
export type HttpVerb = 'get' | 'post' | 'delete' | 'patch' | 'put';

/**
 * Retrieves handler information for a class method.
 * If no information is found, an empty array is returned.
 *
 * @param target The target class
 * @param property The method name
 */
export function getHandlerInfoOf(target: Record<string, any>, property: string | symbol): HandlerInfo[] {
    return Reflect.getOwnMetadata(PROPERTY_INFO_METADATA, target, property) || [];
}

/**
 * Defines handler information for a class method.
 *
 * @param target The target class
 * @param property The method name
 * @param info The information to set
 */
export function setHandlerInfoFor(target: Record<string, any>, property: string | symbol, info: HandlerInfo[]): void {
    Reflect.defineMetadata(PROPERTY_INFO_METADATA, info, target, property);
}

/**
 * Adds an handler information to a class method.
 *
 * @param target The target class
 * @param property The method name
 * @param info The information to add
 */
export function addHandlerInfoFor(target: Record<string, any>, property: string | symbol, info: HandlerInfo): void {
    const handlerInfo = getHandlerInfoOf(target, property);
    handlerInfo.push(info);
    setHandlerInfoFor(target, property, handlerInfo);
}

/**
 * Checks if the given class method is a request handler.
 * A class method is a request handle if there's an handler information attached to it.
 *
 * @param target The target class
 * @param property The method name
 */
export function isHandler(target: Record<string, any>, property: string | symbol): boolean {
    return getHandlerInfoOf(target, property).length > 0;
}
