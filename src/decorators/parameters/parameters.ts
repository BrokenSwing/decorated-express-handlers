import {addParameterInfoFor} from '../../metadata';

function createParamDecoratorFor(source: 'query' | 'header' | 'route'): Function {
    return function(name: string): ParameterDecorator {
        return function (target: Record<string, unknown>, propertyKey: string | symbol, parameterIndex: number): void {
            addParameterInfoFor(target, propertyKey, {
                name,
                source: source,
                index: parameterIndex,
            });
        };
    };
}

export const QueryParam = createParamDecoratorFor('query');
export const HeaderParam = createParamDecoratorFor('header');
export const RouteParam = createParamDecoratorFor('route');
