/**
 * The metadata key for parameters information.
 */
export const PARAM_INFO_METADATA = Symbol('requestParam');

/**
 * Information about a parameter of an handler.
 * Attributes:
 *  - name: the name of the searched value
 *  - source: where to search for the value
 *  - index: where to inject the found value
 */
export interface ParameterInfo {
    name: string;
    source: 'query' | 'route' | 'header';
    index: number;
}

/**
 * Retrieves all parameters information for a class method.
 * If no information exists, it returns an empty array.
 *
 * @param target The target class
 * @param property The method name
 */
export function getParameterInfoOf(target: Record<string, any>, property: string | symbol): ParameterInfo[] {
    return Reflect.getOwnMetadata(PARAM_INFO_METADATA, target, property) || [];
}

/**
 * Defines the parameters information for a class method.
 *
 * @param target The target class
 * @param property The method name
 * @param info The information to set
 */
export function setParameterInfoFor(target: Record<string, any>, property: string | symbol, info: ParameterInfo[]): void {
    return Reflect.defineMetadata(PARAM_INFO_METADATA, info, target, property);
}

/**
 * Add a parameter info for a class method.
 *
 * @param target The target class
 * @param property The method name
 * @param info The information to add
 */
export function addParameterInfoFor(target: Record<string, any>, property: string | symbol, info: ParameterInfo): void {
    const parametersInfo = getParameterInfoOf(target, property);
    parametersInfo.push(info);
    setParameterInfoFor(target, property, parametersInfo);
}
