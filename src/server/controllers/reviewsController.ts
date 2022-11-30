import type { NextFunction, Request, Response } from "express";
import Review from "../../database/models/Review";

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewList = await Review.find();

    res.status(200).json({ review: reviewList });
  } catch (error: unknown) {
    next(error);
  }
};
