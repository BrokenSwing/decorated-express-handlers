"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractFromBody(paramName) {
    return function (req) {
        return req.body[paramName];
    };
}
exports.extractFromBody = extractFromBody;
