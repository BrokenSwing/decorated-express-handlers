import 'reflect-metadata';
import {
    addHandlerInfoFor,
    HttpVerb,
} from '../../metadata';

export interface HandlerDecorator {
    (route: string): Function;
}

function createDecoratorForVerb(verb: HttpVerb): HandlerDecorator {
    return function(route: string): Function {
        return function (target: Record<string, unknown>, propertyKey: string): void {
            addHandlerInfoFor(target, propertyKey, {
                method: verb,
                route,
            });
        };
    };
}

export const Get = createDecoratorForVerb('get');
export const Post = createDecoratorForVerb('post');
export const Delete = createDecoratorForVerb('delete');
export const Patch = createDecoratorForVerb('patch');
export const Put = createDecoratorForVerb('put');
