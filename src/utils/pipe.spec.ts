import {guard, pipe} from './pipe';
import * as chai from 'chai';

const expect = chai.expect;

describe('Utilities functions', () => {

    describe('Pipe function', () => {

        it('should pipe functions correctly', () => {
            const trim = pipe((s: string) => s.trim());
            expect(trim('  hello ')).to.be.eq('hello');

            const add2ThenMultiplyBy3 = pipe(
                (v: number) => v + 2,
                (v: number) => v * 3
            );
            expect(add2ThenMultiplyBy3(1)).to.be.eq(9);

            const stringToIntThenAdd2 = pipe(
                (s: string) => parseInt(s, 10),
                (i: number) => isNaN(i) ? undefined : i,
                (i: number | undefined ) => i !== undefined ? i + 2 : undefined
            );
            expect(stringToIntThenAdd2('12')).to.be.eq(14);
            expect(stringToIntThenAdd2('a')).to.be.undefined;
        });

        it('should return undefined on invalided guard', () => {
            const trimThenLongerThan3 = pipe(
                (s: string) => s.trim(),
                guard((s: string) => s.length > 3)
            );
            expect(trimThenLongerThan3('  foo  ')).to.be.undefined;
        });

        it('should pass through valid guard', () => {
            const trimThenStartsWithNumberThenLowerCase = pipe(
                (s: string) => s.trim(),
                guard((s: string) => /^[0-9]/.test(s)),
                (s: string) => s.toLowerCase()
            );
            expect(trimThenStartsWithNumberThenLowerCase('  52 KM')).to.be.eq('52 km');
        });

    });

});
