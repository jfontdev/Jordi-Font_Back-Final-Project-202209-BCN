import express from "express";

import {
  createReview,
  deleteReview,
  getReviews,
} from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.delete("/delete/:idReview", deleteReview);
reviewsRouter.post("/create", createReview);

export default reviewsRouter;
