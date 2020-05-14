import * as chai from 'chai';
import {Router} from 'express';
import {
    CONTROLLER_INFO_METADATA,
    ControllerInfo,
    getControllerInfoOf,
    setControllerInfo,
    addControllerInfoFor,

    PROPERTY_INFO_METADATA,
    HandlerInfo,
    getHandlerInfoOf,
    setHandlerInfoFor,
    addHandlerInfoFor,

    PARAM_INFO_METADATA,
    ParameterInfo,
    getParameterInfoOf,
    setParameterInfoFor,
    addParameterInfoFor,
} from './index';

const expect = chai.expect;

class TheTarget {

    theMethod(): string {
        return 'Here to fix eslint "no-empty-function" error';
    }

}

describe('Metadata', () => {

    describe('Controller metadata', () => {

        beforeEach(() => {
            Reflect.deleteMetadata(CONTROLLER_INFO_METADATA, TheTarget);
        });

        after(() => {
            Reflect.deleteMetadata(CONTROLLER_INFO_METADATA, TheTarget);
        });

        it('should return an empty array when no metadata were defined', () => {
            expect(getControllerInfoOf(TheTarget)).to.be.empty;
        });

        it('should set and return the given metadata', () => {
            const controllerInfo: ControllerInfo[] = [
                {
                    path: 'One',
                    router: Router(),
                }, {
                    path: 'The second',
                    router: Router()
                }
            ];
            setControllerInfo(TheTarget, controllerInfo);
            expect(getControllerInfoOf(TheTarget)).to.eql(controllerInfo);
        });

        it('should add the given metadata', () => {
            const controllerInfo: ControllerInfo = {
                path: '/myPath',
                router: Router(),
            };
            addControllerInfoFor(TheTarget, controllerInfo);
            expect(getControllerInfoOf(TheTarget)).to.have.length(1);
            expect(getControllerInfoOf(TheTarget)[0]).to.be.eql(controllerInfo);
        });

    });

    describe('Handler metadata', () => {

        beforeEach(() => {
            Reflect.deleteMetadata(PROPERTY_INFO_METADATA, TheTarget, 'theMethod');
        });

        after(() => {
            Reflect.deleteMetadata(PROPERTY_INFO_METADATA, TheTarget, 'theMethod');
        });

        it('should return an empty array when no metadata were defined', () => {
            expect(getHandlerInfoOf(TheTarget, 'theMethod')).to.be.empty;
        });

        it('should set and return the given metadata', () => {
            const handlerInfo: HandlerInfo[] = [
                {
                    method: 'get',
                    route: 'theRoute'
                }, {
                    method: 'post',
                    route: 'otherRoute'
                }
            ];
            setHandlerInfoFor(TheTarget, 'theMethod', handlerInfo);
            expect(getHandlerInfoOf(TheTarget, 'theMethod')).to.eql(handlerInfo);
        });

        it('should add the given metadata', () => {
            const handlerInfo: HandlerInfo = {
                method: 'delete',
                route: 'such a route'
            };
            addHandlerInfoFor(TheTarget, 'theMethod', handlerInfo);
            expect(getHandlerInfoOf(TheTarget, 'theMethod')).to.have.length(1);
            expect(getHandlerInfoOf(TheTarget, 'theMethod')[0]).to.be.eql(handlerInfo);
        });

    });

    describe('Parameter metadata', () => {

        beforeEach(() => {
            Reflect.deleteMetadata(PARAM_INFO_METADATA, TheTarget, 'theMethod');
        });

        after(() => {
            Reflect.deleteMetadata(PARAM_INFO_METADATA, TheTarget, 'theMethod');
        });

        it('should return an empty array when no metadata were defined', () => {
            expect(getParameterInfoOf(TheTarget, 'theMethod')).to.be.empty;
        });

        it('should set and return the given metadata', () => {
            const parameterInfo: ParameterInfo[] = [
                {
                    index: 1,
                    name: 'theName',
                    source: 'route',
                }, {
                    index: 2,
                    name: 'theOtherName',
                    source: 'query'
                }
            ];
            setParameterInfoFor(TheTarget, 'theMethod', parameterInfo);
            expect(getParameterInfoOf(TheTarget, 'theMethod')).to.eql(parameterInfo);
        });

        it('should add the given metadata', () => {
            const parameterInfo: ParameterInfo = {
                source: 'header',
                name: 'a name',
                index: 10
            };
            addParameterInfoFor(TheTarget, 'theMethod', parameterInfo);
            expect(getParameterInfoOf(TheTarget, 'theMethod')).to.have.length(1);
            expect(getParameterInfoOf(TheTarget, 'theMethod')[0]).to.be.eql(parameterInfo);
        });

    });

});
