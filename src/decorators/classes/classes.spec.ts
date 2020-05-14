import {Controller} from './controller';
import {Router} from 'express';
import * as chai from 'chai';

const expect = chai.expect;

class TestSubject {

    public router?: Router;

}

describe('Classes decorators', () => {

    describe('Controller decorator', () => {

        it('should add a router property to class', () => {
            const NewType = Controller('/')(TestSubject);
            const instance = new NewType();
            expect(instance.router).not.to.be.undefined;
        });

    });

});
