import type { Response } from "express";
import type CustomError from "../../CustomError/CustomError";
import { generalError, unknownEndpoint } from "./errors";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a middleware unknown endpoint", () => {
  describe("When it receives a request and a response", () => {
    test("Then the response method status should be invoked with a 404 status code and return an error message 'Unknown endpoint'", () => {
      const expectedStatus = 404;

      const message = "Unknown endpoint";

      unknownEndpoint(null, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith({ message });
    });
  });
});

describe("Given a middleware generalError", () => {
  describe("When it receives a request and a response", () => {
    test("Then the response method status should be invoked with a 500 status code and return an error message 'Failed to connect to the server' ", () => {
      const expectedStatus = 500;

      const expectedErrorMessage = "Failed to connect to the server";

      const error = new Error(expectedErrorMessage);
      generalError(error as CustomError, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ error: expectedErrorMessage });
    });
  });
});
