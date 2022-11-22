import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Credentials, UserTokenPayload } from "../types";
import User from "../../database/models/User.js";
import environment from "../../loadEnvironment.js";

export const usersLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  const user = await User.findOne({ username });

  if (!user) {
    const error = new CustomError("User not found", 401, "Invalid credentials");
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
};
