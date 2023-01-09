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
const js_out_1 = require("../js_out");
const httpMocks = require("node-mocks-http");
const { body } = require("express-validator");
const index = require("../src/index");
/*
 * Creates and returns a test request object with an inputted body
 */
const testRequestWithBody = (body) => {
    return httpMocks.createRequest({
        body: body,
    });
};
const simpleTestBody = { testValue: true };
const simpleChain = [body("testValue").isBoolean().equals("true")];
describe("Testing checkRequestAuthentication", () => {
    const testAuthenticate = (request, response, next) => {
        if (request.token == 123) {
            next();
        }
        else {
            response.status(401).send();
        }
    };
    test("Test with passing authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest({ token: 123 });
        // @ts-ignore
        yield index.checkRequestAuthentication(req, testAuthenticate);
    }));
    test.failing("Test with failing authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest({ token: 124 });
        // @ts-ignore
        yield index.checkRequestAuthentication(req, testAuthenticate);
    }));
});
describe("Testing checkForValidationErrors", () => {
    test("Test with expected pass of chain", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = testRequestWithBody(simpleTestBody);
        const res = httpMocks.createRequest();
    }));
    test("Test with expected fail of chain", () => __awaiter(void 0, void 0, void 0, function* () { }));
});
describe("Testing validationErrors", () => {
    test("Test with no expected validation errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = testRequestWithBody(simpleTestBody);
        const res = httpMocks.createResponse();
        const result = yield (0, js_out_1.validationErrors)(req, res, simpleChain);
        expect(result.isEmpty()).toBeTruthy();
    }));
    test("Test with expected validation errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = testRequestWithBody({});
        const res = httpMocks.createResponse();
        const result = yield (0, js_out_1.validationErrors)(req, res, simpleChain);
        expect(result.isEmpty()).toBeFalsy();
    }));
    describe("test with a chain with more than one validators", () => {
        const chain = [
            ...simpleChain,
            body("anotherValue").exists().equals("justAnotherValue"),
        ];
        test("Test with all passing middleware", () => __awaiter(void 0, void 0, void 0, function* () {
            const testBody = Object.assign(Object.assign({}, simpleTestBody), { anotherValue: "justAnotherValue" });
            const req = testRequestWithBody(testBody);
            const res = httpMocks.createResponse();
            expect((yield (0, js_out_1.validationErrors)(req, res, chain)).isEmpty()).toBeTruthy();
        }));
        test("Test with a failing middleware within longer chain", () => __awaiter(void 0, void 0, void 0, function* () {
            const testBody = Object.assign(Object.assign({}, simpleTestBody), { anotherValue: "notAnotherValue" });
            const req = testRequestWithBody(testBody);
            const res = httpMocks.createResponse();
            expect((yield (0, js_out_1.validationErrors)(req, res, chain)).isEmpty()).toBeFalsy();
        }));
    });
});
describe("Testing testRequiredBodyValues", () => {
    const simpleChain = [body("requiredValue").exists()];
    const simpleBody = { requiredValue: true };
    const simplePaths = ["requiredValue"];
    // TODO
    test("Test with required values", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, js_out_1.testRequiredBodyValues)(simplePaths, simpleBody, simpleChain);
    }));
    test.failing("Test without required values", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, js_out_1.testRequiredBodyValues)(simplePaths, {}, simpleChain);
    }));
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
        test("Test without required values", () => __awaiter(void 0, void 0, void 0, function* () {
            const testBody = {
                requiredValue: true,
                anotherRequiredValue: "here",
                yetAnotherRequiredValue: "a str",
            };
            yield (0, js_out_1.testRequiredBodyValues)(paths, testBody, chain);
        }));
        test.failing("Test with required values", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, js_out_1.testRequiredBodyValues)(paths, simpleBody, chain);
        }));
    });
});
describe("Testing checkForValidationErrors", () => {
    // TODO
});
