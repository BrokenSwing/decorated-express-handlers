import 'reflect-metadata';
import {RouteParam} from './route-parameter';
import {BodyParam} from './body-parameter';
import {PARAM_INFO_METADATA, ParameterInfo} from '../../metadata/parameter-info';

import * as chai from 'chai';

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

            const decorated: ParameterInfo[] = Reflect.getOwnMetadata(PARAM_INFO_METADATA, target, 'a');
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

            const decorator = BodyParam('paramName');
            decorator(target, 'a', 1);

            const decorated: ParameterInfo[] = Reflect.getOwnMetadata(PARAM_INFO_METADATA, target, 'a');
            expect(decorated).to.have.lengthOf(1);
            expect(decorated[0]).to.eql({
                name: 'paramName',
                source: 'body',
                index: 1
            } as ParameterInfo);

        });

    });

});
