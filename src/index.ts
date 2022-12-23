import {ValidationError, Result} from "express-validator";

const { validationResult } = require("express-validator")
const httpMocks = require("node-mocks-http")
const _ = require("lodash")

/** Creates a bearer authorization header */
const bearerAuthHeader = (key: string): object => {
    return { Authorization: `Bearer ${key}` };
};

/**
 * Mock to run an express-validator middleware chain. Takes functionality out of the route itself
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
async function testValidationChain(
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
 * @param requiredValuePaths
 * @param body
 * @param validationChain
 */
async function testRequiredValues(
    requiredValuePaths: Array<string>,
    body: any,
    validationChain: Array<any>
) {
    let request = httpMocks.createRequest({ body: body });
    let response = httpMocks.createResponse();
    expect(
        (
            await testValidationChain(request, response, validationChain)
        ).isEmpty()
    ).toBeTruthy();

    request = httpMocks.createRequest({
        body: _.omit(body, requiredValuePaths),
    });
    response = httpMocks.createResponse();
    expect(
        (
            await testValidationChain(request, response, validationChain)
        ).isEmpty()
    ).toBeFalsy();
}

module.exports = {
    bearerAuthHeader,
    testValidationChain,
    testRequiredValues,
};