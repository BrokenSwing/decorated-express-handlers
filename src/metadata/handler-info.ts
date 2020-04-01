export const PROPERTY_INFO_METADATA = Symbol('handlerInfo');

export interface HandlerInfo {
    method: HttpVerb;
    route: string;
}

export type HttpVerb = 'get' | 'post' | 'delete' | 'patch' | 'put';
