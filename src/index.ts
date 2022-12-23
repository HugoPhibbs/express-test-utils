import {ValidationError, Result} from "express-validator";

const { validationResult } = require("express-validator")
const httpMocks = require("node-mocks-http")
const _ = require("lodash")

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
 * @param requiredValuePaths
 * @param body
 * @param validationChain
 */
export async function testRequiredBodyValues(
    requiredValuePaths: Array<string>,
    body: any,
    validationChain: Array<any>
) {
    let request = httpMocks.createRequest({ body: body });
    let response = httpMocks.createResponse();
    expect(
        (
            await validationErrors(request, response, validationChain)
        ).isEmpty()
    ).toBeTruthy();

    request = httpMocks.createRequest({
        body: _.omit(body, requiredValuePaths),
    });
    response = httpMocks.createResponse();
    expect(
        (
            await validationErrors(request, response, validationChain)
        ).isEmpty()
    ).toBeFalsy();
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

module.exports = {
    bearerAuthHeader,
    testValidationChain: validationErrors,
    testRequiredBodyValues,
    checkForValidationErrors
};