import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError";
import Review from "../../database/models/Review";
import { createReviewMock } from "../../mocks/mockReview";
import { createReview, deleteReview, getReviews } from "./reviewsController";

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

describe("Given a deleteReview controller", () => {
  describe("When it receives a request with an ID 1", () => {
    test("Then it should delete the Review with ID 1", async () => {
      const reviewToDelete = {
        idReview: "1",
      };

      const req: Partial<Request> = {
        params: {
          idReview: "1",
        },
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      Review.findByIdAndDelete = jest.fn().mockReturnValue(reviewToDelete);

      await deleteReview(req as Request, res as Response, null);

      expect(res.json).toHaveBeenCalledWith({ reviewList: reviewToDelete });
    });
  });

  describe("And the review doesn't exist", () => {
    test("Then it should return a status code 404 and the custom error", async () => {
      const expectedError = new CustomError(
        "Review not found by that ID.",
        404,
        "Review not found."
      );

      const req: Partial<Request> = {
        params: { idReview: "6388e62948fcd250640e377d" },
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      Review.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteReview(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When the deleteReview controller fails and it throws an error", () => {
    test("Then it should call the next function with the error", async () => {
      const expectedError = new CustomError(
        "Delete failed",
        500,
        "Delete failed"
      );

      const req: Partial<Request> = {
        params: {
          idReview: "1",
        },
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      Review.findByIdAndDelete = jest.fn().mockRejectedValue(expectedError);

      await deleteReview(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createReview controller", () => {
  describe("When it receives a request with a review that looks exactly the same as ReviewStructure", () => {
    test("Then it should respond with a status code 201", async () => {
      const expectedStatus = 201;
      const review = createReviewMock;

      const req: Partial<Request> = {
        body: review,
      };

      Review.create = jest.fn().mockResolvedValue(review);

      await createReview(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request that makes it throw an error", () => {
    test("Then it should call the next function with an error", async () => {
      const createReviewError = new CustomError(
        "",
        500,
        "Create review failed"
      );

      const req: Partial<Request> = {
        body: {},
      };

      Review.create = jest.fn().mockRejectedValue(createReviewError);

      await createReview(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(createReviewError);
    });
  });
});
