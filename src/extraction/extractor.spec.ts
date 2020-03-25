import {extractFromBody, extractFromRoute} from './index';
import {Request} from 'express';

import * as chai from 'chai';
import {instance, mock, when} from 'ts-mockito';

const expect = chai.expect;

describe('Data extraction from request', () => {

    describe('Route extractor', () => {

        const reqMock = mock<Request>();
        when(reqMock.params).thenReturn({
            id: '5',
        });

        it('should extract value from route parameters', () => {
            const req = instance(reqMock);

            const id = extractFromRoute('id')(req);
            expect(id).to.eq('5');

            const other = extractFromRoute('other')(req);
            expect(other).to.be.undefined;
        });

    });

    describe('Body extractor', () => {

        const reqMock = mock<Request>();
        when(reqMock.body).thenReturn({
            name: 'My name'
        });

        it('should extract value from request body', () => {
            const req = instance(reqMock);

            const name = extractFromBody('name')(req);
            expect(name).to.eq('My name');

            const age = extractFromBody('age')(req);
            expect(age).to.be.undefined;
        });

    });


});
