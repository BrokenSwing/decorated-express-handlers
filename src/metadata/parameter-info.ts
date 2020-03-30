export const PARAM_INFO_METADATA = Symbol('requestParam');

export interface ParameterInfo {
    name: string;
    source: 'body' | 'route' | 'header';
    index: number;
}
