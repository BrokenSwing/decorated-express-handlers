"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractFromRoute(paramName) {
    return function (req) {
        return req.params[paramName];
    };
}
exports.extractFromRoute = extractFromRoute;
