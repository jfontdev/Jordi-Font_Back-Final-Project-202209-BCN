import express from "express";

import {
  createReview,
  deleteReview,
  getReviewById,
  getReviews,
} from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.delete("/delete/:idReview", deleteReview);
reviewsRouter.post("/create", createReview);
reviewsRouter.get("/detail/:idReview", getReviewById);

export default reviewsRouter;
