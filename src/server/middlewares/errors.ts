import debugCreator from "debug";
import chalk from "chalk";
import type CustomError from "../../CustomError/CustomError";
import type { NextFunction, Request, Response } from "express";

const debug = debugCreator("movierating:errors");

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  debug(chalk.red(`There was an error: ${error.message}`));
  const statusCode = error.statusCode ?? 500;
  const publicMessage =
    error.publicMessage || "Failed to connect to the server";

  res.status(statusCode).json({ error: publicMessage });
};

export const unknownEndpoint = (req: Request, res: Response) => {
  debug(chalk.red("Unknown endpoint"));
  res.status(404).json({
    message: "Unknown endpoint",
  });
};
