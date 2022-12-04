import chalk from "chalk";
import debug from "debug";
import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import type { ReviewStructure } from "../../database/models/Review.js";
import Review from "../../database/models/Review.js";

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewList = await Review.find();

    res.status(200).json({ reviewList });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idReview } = req.params;

    const deletedReview = await Review.findByIdAndDelete(idReview);

    if (!deletedReview) {
      const error = new CustomError(
        "Review not found by that ID.",
        404,
        "Review not found."
      );
      debug(chalk.red("The review doesn't exist"));
      next(error);
      return;
    }

    res.status(200).json({ reviewList: deletedReview });
    debug(chalk.green(`The review with the ID ${idReview} was deleted`));
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Delete failed"
    );
    next(customError);
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const receivedReview = req.body as ReviewStructure;

  try {
    const newReview = await Review.create(receivedReview);

    res.status(201).json({ review: { newReview } });
  } catch (error: unknown) {
    const createError = new CustomError(
      (error as Error).message,
      500,
      "Create review failed"
    );
    next(createError);
  }
};
