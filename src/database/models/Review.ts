import type { InferSchemaType } from "mongoose";
import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  favoriteScene: {
    type: String,
  },
});

export type ReviewStructure = InferSchemaType<typeof reviewSchema>;

const Review = model("Review", reviewSchema, "reviews");

export default Review;
