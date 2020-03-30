export function pipe<T, U>(f1: UnaryFunction<T, U>): UnaryFunction<T, U>;
export function pipe<T, U, V>(f1: UnaryFunction<T, U>, f2: UnaryFunction<U, V>): UnaryFunction<T, V>;
export function pipe<T, U, V, W>(
    f1: UnaryFunction<T, U>,
    f2: UnaryFunction<U, V>,
    f3: UnaryFunction<V, W>
): UnaryFunction<T, W>;

export function pipe(... functions: UnaryFunction<unknown, unknown>[]): UnaryFunction<unknown, unknown> {
    if(functions.length === 0) {
        return () => {};
    }
    return functions.reduce((previousValue, currentValue) => {
        return function() {
            const retValue = previousValue.apply(undefined, arguments);
            return currentValue(retValue);
        }
    });
}

export interface UnaryFunction<P, R> extends Function {
    (p: P): R;
}
