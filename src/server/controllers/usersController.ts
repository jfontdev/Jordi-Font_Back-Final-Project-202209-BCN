import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Credentials, RegisterData, UserTokenPayload } from "../types";
import User from "../../database/models/User.js";
import environment from "../../loadEnvironment.js";

export const usersLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      const error = new CustomError(
        "User not found",
        401,
        "Invalid credentials"
      );
      next(error);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Invalid password",
        401,
        "Invalid credentials"
      );
      next(error);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      id: user._id.toString(),
      username,
    };

    const token = jwt.sign(tokenPayload, environment.secretKey);

    res.status(200).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};

export const usersRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error: unknown) {
    const duplicatedRegister = new CustomError(
      (error as Error).message,
      409,
      "El usuario ya existe"
    );
    next(duplicatedRegister);
  }
};
