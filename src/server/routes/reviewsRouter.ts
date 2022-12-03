import express from "express";
import { deleteReview, getReviews } from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.delete("/delete/:idReview", deleteReview);

export default reviewsRouter;
