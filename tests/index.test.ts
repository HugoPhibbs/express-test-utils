import { testRequiredBodyValues, validationErrors } from "../js_out";
import { validationResult } from "express-validator";

const httpMocks = require("node-mocks-http");
const { body } = require("express-validator");

const index = require("../src/index");

/*
 * Creates and returns a test request object with an inputted body
 */
const testRequestWithBody = (body: any) => {
    return httpMocks.createRequest({
        body: body,
    });
};

const simpleTestBody = { testValue: true };
const simpleChain = [body("testValue").isBoolean().equals("true")];

describe("Testing checkRequestAuthentication", () => {
    const testAuthenticate = (request: any, response: any, next: any) => {
        if (request.token == 123) {
            next();
        } else {
            response.status(401).send();
        }
    };

    test("Test with passing authentication", async () => {
        const req = httpMocks.createRequest({ token: 123 });
        // @ts-ignore
        await index.checkRequestAuthentication(req, testAuthenticate);
    });

    test.failing("Test with failing authentication", async () => {
        const req = httpMocks.createRequest({ token: 124 });
        // @ts-ignore
        await index.checkRequestAuthentication(req, testAuthenticate);
    });
});

describe("Testing checkForValidationErrors", () => {
    test("Test with expected pass of chain", async () => {
        const req = testRequestWithBody(simpleTestBody);
        const res = httpMocks.createRequest();
    });

    test("Test with expected fail of chain", async () => {});
});

describe("Testing validationErrors", () => {
    test("Test with no expected validation errors", async () => {
        const req = testRequestWithBody(simpleTestBody);
        const res = httpMocks.createResponse();
        const result = await validationErrors(req, res, simpleChain);
        expect(result.isEmpty()).toBeTruthy();
    });

    test("Test with expected validation errors", async () => {
        const req = testRequestWithBody({});
        const res = httpMocks.createResponse();
        const result = await validationErrors(req, res, simpleChain);
        expect(result.isEmpty()).toBeFalsy();
    });

    describe("test with a chain with more than one validators", () => {
        const chain = [
            ...simpleChain,
            body("anotherValue").exists().equals("justAnotherValue"),
        ];

        test("Test with all passing middleware", async () => {
            const testBody = {
                ...simpleTestBody,
                anotherValue: "justAnotherValue",
            };
            const req = testRequestWithBody(testBody);
            const res = httpMocks.createResponse();
            expect(
                (await validationErrors(req, res, chain)).isEmpty()
            ).toBeTruthy();
        });

        test("Test with a failing middleware within longer chain", async () => {
            const testBody = {
                ...simpleTestBody,
                anotherValue: "notAnotherValue",
            };
            const req = testRequestWithBody(testBody);
            const res = httpMocks.createResponse();
            expect(
                (await validationErrors(req, res, chain)).isEmpty()
            ).toBeFalsy();
        });
    });
});

describe("Testing testRequiredBodyValues", () => {
    const simpleChain = [body("requiredValue").exists()];
    const simpleBody = { requiredValue: true };
    const simplePaths = ["requiredValue"];
    // TODO

    test("Test with required values", async () => {
        await testRequiredBodyValues(simplePaths, simpleBody, simpleChain);
    });

    test.failing("Test without required values", async () => {
        await testRequiredBodyValues(simplePaths, {}, simpleChain);
    });

    describe("Test required values with a longer chain", () => {
        const chain = [
            ...simpleChain,
            body("anotherRequiredValue").exists(),
            body("yetAnotherRequiredValue").exists(),
        ];
        const paths = [
            "requiredValue",
            "anotherRequiredValue",
            "yetAnotherRequiredValue",
        ];

        test("Test without required values", async () => {
            const testBody = {
                requiredValue: true,
                anotherRequiredValue: "here",
                yetAnotherRequiredValue: "a str",
            };
            await testRequiredBodyValues(paths, testBody, chain);
        });

        test.failing("Test with required values", async () => {
            await testRequiredBodyValues(paths, simpleBody, chain);
        });
    });
});
