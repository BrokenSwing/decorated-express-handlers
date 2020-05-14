import {getParameterInfoOf, ParameterInfo} from '../../metadata';

import * as chai from 'chai';
import {BodyParam, HeaderParam, QueryParam, RouteParam} from './parameters';

const expect = chai.expect;

class TestSubject {

    a(theParamName: number): string {
        return `Hello, World! ${theParamName}`;
    }

}

describe('Parameters decorators', () => {

    describe('Route parameter', () => {

        it('should store metadata', () => {
            const target = new TestSubject();

            const decorator = RouteParam('paramName');
            decorator(target, 'a', 1);

            const decorated: ParameterInfo[] = getParameterInfoOf(target, 'a');
            expect(decorated).to.have.lengthOf(1);
            expect(decorated[0]).to.eql({
                name: 'paramName',
                source: 'route',
                index: 1
            } as ParameterInfo);

        });

    });

    describe('Body parameter', () => {

        it('should store metadata', () => {
            const target = new TestSubject();

            const decorator = QueryParam('paramName');
            decorator(target, 'a', 1);

            const decorated: ParameterInfo[] = getParameterInfoOf(target, 'a');
            expect(decorated).to.have.lengthOf(1);
            expect(decorated[0]).to.eql({
                name: 'paramName',
                source: 'query',
                index: 1
            } as ParameterInfo);

        });

    });

    describe('Header parameter', () => {

        it('should store metadata', () => {
            const target = new TestSubject();

            const decorator = HeaderParam('paramName');
            decorator(target, 'a', 1);

            const decorated: ParameterInfo[] = getParameterInfoOf(target, 'a');
            expect(decorated).to.have.lengthOf(1);
            expect(decorated[0]).to.eql({
                name: 'paramName',
                source: 'header',
                index: 1
            } as ParameterInfo);
        });

    });

    describe('Body parameter', () => {

        it('should store metadata', () => {
            const target = new TestSubject();

            const decorator = BodyParam('aName');
            decorator(target, 'a', 18);

            const decorated: ParameterInfo[] = getParameterInfoOf(target, 'a');
            expect(decorated).to.have.lengthOf(1);
            expect(decorated[0]).to.eql({
                name: 'aName',
                source: 'body',
                index: 18
            } as ParameterInfo);
        });

    });

});
