/// <reference types="express-serve-static-core" />
import { ValidationError, Result } from "express-validator";
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
export declare function testValidationChain(req: Express.Request, res: Express.Response, validationChain: Array<any>): Promise<Result<ValidationError>>;
/**
 * Tests required values in a request body
 *
 * @param requiredValuePaths
 * @param body
 * @param validationChain
 */
export declare function testRequiredValues(requiredValuePaths: Array<string>, body: any, validationChain: Array<any>): Promise<void>;
