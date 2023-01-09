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
const sinon = require("sinon");
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
 * @param req Request an Express Request
 * @param res Response an Express Response
 * @param validationChain an express-validator validation chain to check for validation errors against
 * @return Result containing validation errors, as per express-validator
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
 * @param requiredValuePaths strings for the paths of required values within a body. Checks these are required one by one
 * @param body object for an object to be added to an express request
 * @param validationChain array for an express-validator validation chain to check against a request body
 */
function testRequiredBodyValues(requiredValuePaths, body, validationChain) {
    return __awaiter(this, void 0, void 0, function* () {
        let request = httpMocks.createRequest({ body: body });
        let response = httpMocks.createResponse();
        expect((yield validationErrors(request, response, validationChain)).isEmpty()).toBeTruthy();
        for (let path of requiredValuePaths) {
            request = httpMocks.createRequest({
                body: _.omit(body, path),
            });
            response = httpMocks.createResponse();
            expect((yield validationErrors(request, response, validationChain)).isEmpty()).toBeFalsy();
        }
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
/**
 * Checks that a request passes authentication with the given authenticate function
 *
 * @param request Request to be checked
 * @param authenticate authentication function to run. Expected to mark a response with a 401 status code if authentication failed, otherwise a next() function should be called
 */
function checkRequestAuthentication(request, authenticate) {
    return __awaiter(this, void 0, void 0, function* () {
        const nextSpy = sinon.spy();
        const response = httpMocks.createResponse();
        yield authenticate(request, response, nextSpy);
        expect(nextSpy.statusCode != 401).toBeTruthy();
        expect(nextSpy.calledOnce).toBeTruthy();
    });
}
module.exports = {
    bearerAuthHeader,
    validationErrors,
    testRequiredBodyValues,
    checkForValidationErrors,
    checkRequestAuthentication
};
