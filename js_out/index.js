"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRequiredBodyValues = exports.validationErrors = void 0;
const { validationResult } = require("express-validator");
const httpMocks = require("node-mocks-http");
const _ = require("lodash");
/** Creates a bearer authorization header */
const bearerAuthHeader = (key) => {
    return { Authorization: `Bearer ${key}` };
};
/**
 * Runs a request through a validation chain, returns any validation errors in doing so
 *
 * Makes it easy to test validation middleware
 *
 * https://stackoverflow.com/questions/28769200/unit-testing-validation-with-express-validator
 *
 * @param req Request
 * @param res Response
 * @param validationChain
 * @return Result containing validation errors
 */
function validationErrors(req, res, validationChain) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(validationChain.map((middleware) => __awaiter(this, void 0, void 0, function* () {
            yield middleware(req, res, () => undefined);
        })));
        return validationResult(req);
    });
}
exports.validationErrors = validationErrors;
/**
 * Tests required values in a request body
 *
 * @param requiredValuePaths
 * @param body
 * @param validationChain
 */
function testRequiredBodyValues(requiredValuePaths, body, validationChain) {
    return __awaiter(this, void 0, void 0, function* () {
        let request = httpMocks.createRequest({ body: body });
        let response = httpMocks.createResponse();
        expect((yield validationErrors(request, response, validationChain)).isEmpty()).toBeTruthy();
        request = httpMocks.createRequest({
            body: _.omit(body, requiredValuePaths),
        });
        response = httpMocks.createResponse();
        expect((yield validationErrors(request, response, validationChain)).isEmpty()).toBeFalsy();
    });
}
exports.testRequiredBodyValues = testRequiredBodyValues;
/**
 * Checks that a request does not pass validation by passing it through a express-validator validation chain
 *
 * @param request Request object to be checked by the chain
 * @param validationChain array for an express-validator validator chain
 * @param shouldBeNoErrors boolean for if no errors should be raised by a request, once it has run through the validation chain
 */
function checkForValidationErrors(request, validationChain, shouldBeNoErrors) {
    return __awaiter(this, void 0, void 0, function* () {
        expect((yield validationErrors(request, httpMocks.createResponse(), validationChain)).isEmpty()).toBe(shouldBeNoErrors);
    });
}
module.exports = {
    bearerAuthHeader,
    testValidationChain: validationErrors,
    testRequiredBodyValues,
    checkForValidationErrors
};
