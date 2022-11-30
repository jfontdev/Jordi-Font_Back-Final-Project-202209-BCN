import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import databaseConnection from "../../database/databaseConnection";
import Review from "../../database/models/Review";
import app from "../app";
import request from "supertest";

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
