import type { NextFunction, Request, Response } from "express";
import Review from "../../database/models/Review";
import { getReviews } from "./reviewsController";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req: Partial<Request> = {};

const next = jest.fn();

describe("Given a getReviews controller", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a status code 200", async () => {
      const expectedStatus = 200;

      Review.find = jest.fn();

      await getReviews(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request and it fails", () => {
    test("Then it should call the next function and a empty error ", async () => {
      const expectedError = new Error("");

      Review.find = jest.fn().mockRejectedValue(expectedError);

      await getReviews(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
