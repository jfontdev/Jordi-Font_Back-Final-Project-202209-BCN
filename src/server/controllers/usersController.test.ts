import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../CustomError/CustomError";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import type { Credentials } from "../types";
import { usersLogin, usersRegister } from "./usersController";
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

  describe("When the login controller fails and throws an error", () => {
    test("Then it should call the next function with the error", async () => {
      const expectedError = new Error("");

      User.findOne = jest.fn().mockRejectedValue(expectedError);

      await usersLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a usersRegister controller", () => {
  const newUser = {
    username: "user2",
    password: "123456",
    email: "user2@gmail.com",
  };

  req.body = newUser;

  describe("When it receives a new user that doesn't exist", () => {
    test("Then it should register that user and return a status code 201", async () => {
      const expectedStatus = 201;

      const userId = new mongoose.Types.ObjectId();

      const expectedBody = {
        user: {
          username: newUser.username,
          email: newUser.email,
          id: userId,
        },
      };

      const hashedPassword = await bcrypt.hash(newUser.password, 10);

      User.create = jest.fn().mockResolvedValue({
        username: newUser.username,
        password: hashedPassword,
        email: newUser.email,
        _id: userId,
      });

      await usersRegister(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe("When it receives a user that already exists", () => {
    test("Then it shoudl call the next function, return a status code 409 and the error message 'El usuario ya existe'", async () => {
      const duplicatedRegister = new CustomError(
        "duplicate key",
        409,
        "El usuario ya existe"
      );

      User.create = jest.fn().mockRejectedValueOnce(duplicatedRegister);

      await usersRegister(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(duplicatedRegister);
    });
  });
});
