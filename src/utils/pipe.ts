const GUARD_EXCEPTION = new Error('Predicate did not match');

export function pipe<T, U>(f1: UnaryFunction<T, U>): UnaryFunction<T, U | undefined>;
export function pipe<T, U, V>(f1: UnaryFunction<T, U>, f2: UnaryFunction<U, V>): UnaryFunction<T, V | undefined>;
export function pipe<T, U, V, W>(
    f1: UnaryFunction<T, U>,
    f2: UnaryFunction<U, V>,
    f3: UnaryFunction<V, W>
): UnaryFunction<T, W | undefined>;

export function pipe(... functions: UnaryFunction<unknown, unknown>[]): UnaryFunction<unknown, unknown | undefined> {
    if(functions.length === 0) {
        return (): undefined => undefined;
    }
    return functions.reduce((previousValue, currentValue) => {
        return function(... theArgs): unknown | undefined {
            const retValue = previousValue.call(undefined, ... theArgs);
            try {
                return currentValue(retValue);
            } catch (_) {
                return undefined;
            }
        };
    });
}

export function guard<T>(predicate: UnaryFunction<T, boolean>): UnaryFunction<T, T> {
    return function (value: T): T {
        if (predicate(value)) {
            return value;
        } else {
            throw GUARD_EXCEPTION;
        }
    };
}

export interface UnaryFunction<P, R> extends Function {
    (p: P): R;
}
