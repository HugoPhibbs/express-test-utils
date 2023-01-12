/// <reference types="express-serve-static-core" />
import { ValidationError, Result } from "express-validator";
import { Request, Response, NextFunction } from "express";
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
export declare function validationErrors(req: Express.Request, res: Express.Response, validationChain: Array<any>): Promise<Result<ValidationError>>;
/**
 * Tests required values in a request body
 *
 * @param requiredValuePaths strings for the paths of required values within a body. Checks these are required one by one
 * @param body object for an object to be added to an express request
 * @param validationChain array for an express-validator validation chain to check against a request body
 */
export declare function testRequiredBodyValues(requiredValuePaths: Array<string>, body: object, validationChain: Array<any>): Promise<void>;
/**
 * Checks that a request does not pass validation by passing it through a express-validator validation chain
 *
 * @param request Request object to be checked by the chain
 * @param validationChain array for an express-validator validator chain
 * @param shouldBeNoErrors boolean for if no errors should be raised by a request, once it has run through the validation chain
 */
export declare function checkForValidationErrors(request: Request, validationChain: Array<any>, shouldBeNoErrors: boolean): Promise<void>;
/**
 * Checks that a request passes authentication with the given authenticate function
 *
 * @param request Request to be checked
 * @param authenticate authentication function to run. Expected to mark a response with a 401 status code if authentication failed, otherwise a next() function should be called
 */
export declare function checkRequestAuthentication(request: Request, authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>): Promise<void>;
