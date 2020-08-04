import 'reflect-metadata';
export * from './controller-info';
export * from './handler-info';
export * from './parameter-info';
export * from './field-info';

/**
 * Retrieve parameters type of the method with the given name of the given prototype.
 *
 * @param prototype The prototype to get the method from
 * @param methodName The method name
 *
 * @return an array containing the names of the parameters types
 */
export function getParametersTypesOf(prototype: Record<string, any>, methodName: string): string[] {
    return Reflect.getMetadata('design:paramtypes', prototype, methodName)
        .map((t: Record<string, unknown>) => t.name);
}

/**
 * Retrieves the type of the property with the given name on the given prototype.
 * 
 * @param prototype The prototype to get property from
 * @param propertyName The property name
 */
export function getPropertyTypeOf(prototype: Record<string, any>, propertyName: string): string | undefined {
    return Reflect.getMetadata('design:type', prototype, propertyName)?.name;
}
