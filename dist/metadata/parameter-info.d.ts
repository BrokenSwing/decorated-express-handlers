export declare const PARAM_INFO_METADATA: unique symbol;
export interface ParameterInfo {
    name: string;
    source: 'body' | 'route';
    index: number;
}
