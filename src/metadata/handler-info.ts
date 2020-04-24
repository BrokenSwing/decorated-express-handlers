import 'reflect-metadata';

export const PROPERTY_INFO_METADATA = Symbol('handlerInfo');

export interface HandlerInfo {
    method: HttpVerb;
    route: string;
}

export type HttpVerb = 'get' | 'post' | 'delete' | 'patch' | 'put';

export function getHandlerInfoOf(target: Record<string, any>, property: string | symbol): HandlerInfo[] {
    return Reflect.getOwnMetadata(PROPERTY_INFO_METADATA, target, property) || [];
}

export function isHandler(target: Record<string, any>, property: string | symbol): boolean {
    return getHandlerInfoOf(target, property).length > 0;
}
