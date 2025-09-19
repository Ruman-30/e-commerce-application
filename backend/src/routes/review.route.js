import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import {
  createReviewController,
  deleteReviewController,
  getAllReviewsController,
} from "../controllers/review.controller.js";
import {
  validateCreateReview,
  handleValidationErrors,
} from "../middleware/validator.middleware.js";
const router = express.Router();

router.post(
  "/product/:productId",
  authentication,
  validateCreateReview,
  handleValidationErrors,
  createReviewController
);

router.delete(
  "/product/:productId/delete",
  authentication,
  deleteReviewController
);

router.get(
  "/product/:productId/reviews",
  authentication,
  getAllReviewsController
);
export default router;
