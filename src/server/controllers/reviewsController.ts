import chalk from "chalk";
import debug from "debug";
import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
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
      res.status(404).json("Review not found by that ID.");
      debug(chalk.red("The review doesn't exist"));
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
