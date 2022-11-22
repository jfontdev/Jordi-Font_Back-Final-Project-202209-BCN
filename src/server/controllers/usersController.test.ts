import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../CustomError/CustomError";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import type { Credentials } from "../types";
import { usersLogin } from "./usersController";
import mongoose from "mongoose";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req: Partial<Request> = {};

const next = jest.fn();

describe("Given a User controller", () => {
  const loginUser: Credentials = {
    username: "user1",
    password: "123456",
  };

  req.body = loginUser;

  describe("When it receives an invalid username", () => {
    test("Then it should call the next function a user error", async () => {
      User.findOne = jest.fn().mockReturnValue(null);

      const expectedError = new CustomError(
        "User not found",
        401,
        "Invalid credentials"
      );

      await usersLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a valid username with an invalid password", () => {
    test("Then it should call the next function with a password error", async () => {
      User.findOne = jest.fn().mockResolvedValue(loginUser);

      const expectedError = new CustomError(
        "Invalid password",
        401,
        "Invalid credentials"
      );

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await usersLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("When it receives a valid username 'user1' and passowrd '123456'", () => {
    test("Then it should return a status code 200 and the token", async () => {
      req.body = loginUser;

      const expectedStatus = 200;
      const expectedBody = { token: "token" };

      const userId = new mongoose.Types.ObjectId();

      User.findOne = jest.fn().mockReturnValue({
        username: loginUser.username,
        password: loginUser.password,
        _id: userId,
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      jwt.sign = jest.fn().mockReturnValue("token");

      await usersLogin(req as Request, res as Response, next as NextFunction);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(expectedBody);
    });
  });
});
