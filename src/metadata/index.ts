import 'reflect-metadata';
export * from './controller-info';
export * from './handler-info';
export * from './parameter-info';

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
