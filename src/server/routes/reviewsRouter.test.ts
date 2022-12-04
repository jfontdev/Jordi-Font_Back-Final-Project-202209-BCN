import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import databaseConnection from "../../database/databaseConnection";
import Review from "../../database/models/Review";
import app from "../app";
import request from "supertest";
import {
  createReviewMock,
  reviewMock,
  reviewNotFoundMock,
} from "../../mocks/mockReview";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await databaseConnection(server.getUri());
});

beforeEach(async () => {
  await Review.deleteMany({});
});

afterAll(async () => {
  await server.stop();
  await mongoose.disconnect();
});

describe("Given a GET /reviews endpoint", () => {
  describe("When it receives a request with no reviews", () => {
    test("Then it should return a status code 200 and array of empty reviews", async () => {
      const expectedStatus = 200;

      Review.find = jest.fn().mockReturnValue(null);

      const response = await request(app)
        .get("/reviews")
        .expect(expectedStatus);

      expect(response.body).toStrictEqual({ reviewList: null });
    });
  });

  describe("When it receives a request and it fails", () => {
    test("Then it should return a 500 status and a error ", async () => {
      const expectedStatus = 500;
      const expectedError = { error: "Failed to connect to the server" };

      Review.find = jest.fn().mockRejectedValue(expectedError);

      const response = await request(app)
        .get("/reviews")
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedError);
    });
  });
});

describe("Given a DELETE /reviews/delete/:idReview", () => {
  const review = reviewMock;

  describe("When it receives a review with an ID '6388e62948fcd250640e377d'", () => {
    test("Then it should return a status code 200 an delete the review with ID '6388e62948fcd250640e377d'", async () => {
      const expectedStatus = 200;

      await Review.create(review);

      const response = await request(app)
        .delete(`/reviews/delete/${review._id}`)
        .expect(expectedStatus);

      expect(response.status).toBe(expectedStatus);
    });
  });

  describe("When it receives a review with an ID that doesn't exist", () => {
    test("Then it should return a status code 404 and the error 'Review not found.'", async () => {
      const expectedStatus = 404;

      const expectedErrorMessage = "Review not found.";

      const reviewNotFound = reviewNotFoundMock;

      await Review.create(review);

      const response = await request(app).delete(
        `/reviews/delete/${reviewNotFound._id}`
      );

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });

  describe("When it receives a request with and an internal server error", () => {
    test("Then it should return a '500' status code with error text 'Delete failed'", async () => {
      const expectedStatus = 500;
      const expectedErrorMessage = { error: "Delete failed" };

      Review.findByIdAndDelete = jest
        .fn()
        .mockRejectedValue(expectedErrorMessage);

      const response = await request(app)
        .delete(`/reviews/delete/${review._id}`)
        .expect(expectedStatus);

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});

describe("Given a POST /reviews/create endpoint", () => {
  describe("When it receives a request with a valid review", () => {
    test("Then it should respond with a status code 201 and a body with the review", async () => {
      const expectedStatus = 201;
      const reviewBody = createReviewMock;

      const res = await request(app)
        .post("/reviews/create")
        .send(reviewBody)
        .expect(expectedStatus);

      expect(res.body).toHaveProperty("review");
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should throw an error with the message 'Create Review failed' and the status code 500", async () => {
      const expectedStatus = 500;
      const expectedError = { error: "Create review failed" };

      Review.create = jest.fn().mockRejectedValue(expectedError);

      const response = await request(app)
        .post("/reviews/create")
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedError);
    });
  });
});
