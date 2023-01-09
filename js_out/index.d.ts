/// <reference types="express-serve-static-core" />
import { ValidationError, Result } from "express-validator";
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
export declare function validationErrors(req: Express.Request, res: Express.Response, validationChain: Array<any>): Promise<Result<ValidationError>>;
/**
 * Tests required values in a request body
 *
 * @param requiredValuePaths strings for the paths of required values within a body. Checks these are required one by one
 * @param body object for an object to be added to an express request
 * @param validationChain array for an express-validator validation chain to check against a request body
 */
export declare function testRequiredBodyValues(requiredValuePaths: Array<string>, body: object, validationChain: Array<any>): Promise<void>;
