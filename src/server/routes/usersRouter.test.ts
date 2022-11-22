import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import request from "supertest";
import databaseConnection from "../../database/databaseConnection";
import User from "../../database/models/User";
import app from "../app";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await databaseConnection(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await server.stop();
  await mongoose.disconnect();
});

describe("Given a POST users/login endpoint", () => {
  const loginUser = {
    username: "user1",
    password: "123456",
    email: "user1@gmail.com",
  };

  describe("When it receives a user with the username 'user1' and the password '123456' and email 'user1@gmail.com'", () => {
    test("Then it should return a status code 200 and a token", async () => {
      const expectedStatus = 200;

      const hashedPassword = await bcrypt.hash(loginUser.password, 10);

      await User.create({
        username: loginUser.username,
        password: hashedPassword,
        email: loginUser.email,
      });

      const response = await request(app)
        .post("/users/login")
        .send(loginUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives an invalid username 'user2' with password '123456' and email 'user2@gmail.com'", () => {
    test("Then it should return an status code 401 and an error message 'Invalid credentials'", async () => {
      const expectedStatus = 401;

      const expectedErrorMessage = "Invalid credentials";

      const hashedPassword = await bcrypt.hash(loginUser.password, 10);

      await User.create({
        username: loginUser.username,
        password: hashedPassword,
        email: loginUser.username,
      });

      const invalidUser = {
        username: "user2",
        password: "123456",
        email: "user2@gmail.com",
      };

      const response = await request(app)
        .post("/users/login")
        .send(invalidUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });

  describe("When it receives an invalid password with the user 'user1' password '654321' and email 'user1@gmail.com'", () => {
    test("Then it should return an status code 401 and the error message 'Invalid credentials'", async () => {
      const expectedStatus = 401;

      const expectedErrorMessage = "Invalid credentials";

      const hashedPassword = await bcrypt.hash(loginUser.password, 10);

      await User.create({
        username: loginUser.username,
        password: hashedPassword,
        email: loginUser.email,
      });

      const invalidPassword = {
        username: "user1",
        password: "654321",
        email: "user1@gmail.com",
      };

      const response = await request(app)
        .post("/users/login")
        .send(invalidPassword)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});
