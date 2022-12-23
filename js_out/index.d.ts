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
 * @param requiredValuePaths
 * @param body
 * @param validationChain
 */
export declare function testRequiredBodyValues(requiredValuePaths: Array<string>, body: any, validationChain: Array<any>): Promise<void>;
