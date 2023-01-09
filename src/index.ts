import {ValidationError, Result} from "express-validator";
import {Request, Response, NextFunction} from "express"

const { validationResult } = require("express-validator")
const httpMocks = require("node-mocks-http")
const _ = require("lodash")

const sinon = require("sinon")

/** Creates a bearer authorization header */
const bearerAuthHeader = (key: string): object => {
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
export async function validationErrors(
    req: Express.Request,
    res: Express.Response,
    validationChain: Array<any>
): Promise<Result<ValidationError>> {
    await Promise.all(
        validationChain.map(async (middleware) => {
            await middleware(req, res, () => undefined);
        })
    );
    return validationResult(req);
}

/**
 * Tests required values in a request body
 *
 * @param requiredValuePaths strings for the paths of required values within a body. Checks these are required one by one
 * @param body object for an object to be added to an express request
 * @param validationChain array for an express-validator validation chain to check against a request body
 */
export async function testRequiredBodyValues(
    requiredValuePaths: Array<string>,
    body: object,
    validationChain: Array<any>
) {
    let request = httpMocks.createRequest({ body: body });
    let response = httpMocks.createResponse();
    expect(
        (
            await validationErrors(request, response, validationChain)
        ).isEmpty()
    ).toBeTruthy();

    for (let path of requiredValuePaths) {
        request = httpMocks.createRequest({
            body: _.omit(body, path),
        });
        response = httpMocks.createResponse();
        expect(
          (
            await validationErrors(request, response, validationChain)
          ).isEmpty()
        ).toBeFalsy();
    }
}

/**
 * Checks that a request does not pass validation by passing it through a express-validator validation chain
 *
 * @param request Request object to be checked by the chain
 * @param validationChain array for an express-validator validator chain
 * @param shouldBeNoErrors boolean for if no errors should be raised by a request, once it has run through the validation chain
 */
async function checkForValidationErrors(request: Request, validationChain: Array<any>, shouldBeNoErrors: boolean) {
    expect((await validationErrors(request, httpMocks.createResponse(), validationChain)).isEmpty()).toBe(shouldBeNoErrors)
}

/**
 * Checks that a request passes authentication with the given authenticate function
 *
 * @param request Request to be checked
 * @param authenticate authentication function to run. Expected to mark a response with a 401 status code, otherwise a next() function should be called
 */
async function checkRequestAuthentication(request: Request, authenticate : (req:Request, res:Response, next: NextFunction)=>void) {
    const nextSpy = sinon.spy()
    const response = httpMocks.createResponse()
    await authenticate(request, response, nextSpy)
    expect(response.statusCode)
}

module.exports = {
    bearerAuthHeader,
    validationErrors,
    testRequiredBodyValues,
    checkForValidationErrors
};