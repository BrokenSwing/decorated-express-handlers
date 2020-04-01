import 'reflect-metadata';
import {HandlerInfo, HttpVerb, PROPERTY_INFO_METADATA} from '../../metadata/handler-info';

export interface HandlerDecorator {
    (route: string): Function;
}

function createDecoratorForVerb(verb: HttpVerb): HandlerDecorator {
    return function(route: string): Function {
        return function (
            target: Record<string, unknown>,
            propertyKey: string
        ): void {
            const handlerInfo: HandlerInfo[] = Reflect.getOwnMetadata(PROPERTY_INFO_METADATA, target, propertyKey) || [];
            handlerInfo.push({
                method: verb,
                route,
            });
            Reflect.defineMetadata(PROPERTY_INFO_METADATA, handlerInfo, target, propertyKey);
        };
    };
}

export const Get = createDecoratorForVerb('get');
export const Post = createDecoratorForVerb('post');
export const Delete = createDecoratorForVerb('delete');
export const Patch = createDecoratorForVerb('patch');
export const Put = createDecoratorForVerb('put');
