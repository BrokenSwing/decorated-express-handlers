export const PARAM_INFO_METADATA = Symbol('requestParam');

export interface ParameterInfo {
    name: string;
    source: 'body' | 'route';
    index: number;
}
