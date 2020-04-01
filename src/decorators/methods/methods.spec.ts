import 'reflect-metadata';

import {
    Get,
    Post,
} from './http-verb';
import * as chai from 'chai';
import {HandlerInfo, PROPERTY_INFO_METADATA} from '../../metadata/handler-info';

const expect = chai.expect;

class TestSubject {

    toTest(): string {
        return 'Hello guy';
    }

}

describe('Methods decorators', () => {

    describe('Routing decorators', () => {

        it('should store correct routing metadata', () => {
            const idRouteGet = Get('/:id');
            idRouteGet(TestSubject.prototype, 'toTest');

            let handlersInfo: HandlerInfo[] =
                Reflect.getOwnMetadata(PROPERTY_INFO_METADATA, TestSubject.prototype, 'toTest');
            expect(handlersInfo).to.have.lengthOf(1);
            expect(handlersInfo[0]).to.eql({
                method: 'get',
                route: '/:id'
            } as HandlerInfo);

            const nameRoutePost = Post('/:id/name');
            nameRoutePost(TestSubject.prototype, 'toTest');

            handlersInfo = Reflect.getOwnMetadata(PROPERTY_INFO_METADATA, TestSubject.prototype, 'toTest');
            expect(handlersInfo).to.have.lengthOf(2);
            expect(handlersInfo[1]).to.eql({
                method: 'post',
                route: '/:id/name'
            } as HandlerInfo);
        });

    });

});
