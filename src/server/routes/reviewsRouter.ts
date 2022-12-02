import express from "express";
import { getReviews } from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);

export default reviewsRouter;
