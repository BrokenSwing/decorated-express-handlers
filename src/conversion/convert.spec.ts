import {convertToInteger, convertToString} from './convert';

import * as chai from 'chai';

const expect = chai.expect;

describe('Conversion functions', () => {

    describe('String -> Integer conversion', () => {

        it('should convert string to number correctly when provided string is correctly formatted', () => {
            expect(convertToInteger('1254')).to.eq(1254);
            expect(convertToInteger('-478')).to.eq(-478);
            expect(convertToInteger('0007')).to.eq(7);
            expect(convertToInteger('-004.6')).to.eq(-4);
        });

        it('should return undefined when provided string is not a number', () => {
            expect(convertToInteger('Hello world !')).to.be.undefined;
            expect(convertToInteger('')).to.be.undefined;
            expect(convertToInteger('--1')).to.be.undefined;
        });

    });

    describe('String -> String conversion', () => {

        it('should trim the given string', () => {
            expect(convertToString('    Left trimming')).to.eq('Left trimming');
            expect(convertToString('Right trimming     ')).to.eq('Right trimming');
            expect(convertToString('    Left-Right trimming     ')).to.eq('Left-Right trimming');
        });

    });

});
