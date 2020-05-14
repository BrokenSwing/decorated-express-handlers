const GUARD_EXCEPTION = new Error('Predicate did not match');

/**
 * Returns the an equivalent function of the given one.
 *
 * @param f1 the function to get identity of
 */
export function pipe<T, U>(f1: UnaryFunction<T, U>): UnaryFunction<T, U | undefined>;

/**
 * Pipes two functions. The result of the first one is passed to the second one.
 *
 * @param f1 The first function
 * @param f2 The second function, that accepts the return value of the first given function
 */
export function pipe<T, U, V>(f1: UnaryFunction<T, U>, f2: UnaryFunction<U, V>): UnaryFunction<T, V | undefined>;

/**
 * Pipes three functions. The result of the first one is passed to the second one and then the result of the
 * second one is passed to the third one.
 *
 * @param f1 The first function
 * @param f2 The second function, that accepts the return value of the first given function
 * @param f3 The third function, that accepts the return value of the second given function
 */
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

/**
 * Allows to stop function piping. If the predicate does not match, the value
 * isn't passed to the next function and undefined is returned.<br>
 * Example:
 * <pre>
 *     function addTwo(v: number): number { return v + 2; }
 *     function numberToString(v: number): string { return `${v}`; }
 *
 *     const resultFunc = pipe(addTwo, guard((v: number) => v > 5), numberToString);
 *     resultFunc(3); // Returns: undefined
 *     resultFunc(4); // Returns: '6'
 *     resultFunc(8); // Returns: '10'
 * </pre>
 *
 * @param predicate The function to test the received value
 */
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
