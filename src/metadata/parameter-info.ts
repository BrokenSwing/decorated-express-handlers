export const PARAM_INFO_METADATA = Symbol('requestParam');

export interface ParameterInfo {
    name: string;
    source: 'query' | 'route' | 'header';
    index: number;
}

export function getParameterInfoOf(target: Record<string, any>, property: string | symbol): ParameterInfo[] {
    return Reflect.getOwnMetadata(PARAM_INFO_METADATA, target, property) || [];
}
