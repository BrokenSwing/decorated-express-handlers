"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertToInteger(value) {
    var result = parseInt(value, 10);
    if (isNaN(result)) {
        return undefined;
    }
    return result;
}
exports.convertToInteger = convertToInteger;
function convertToString(value) {
    return value.trim();
}
exports.convertToString = convertToString;
