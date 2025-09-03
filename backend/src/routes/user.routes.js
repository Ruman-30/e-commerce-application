import express from "express";
import {
  createUserRegisterController,
  createUserLoginController,
  forgotPasswordController,
  resetPasswordController
} from "../controllers/user.controllers.js";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../middleware/validator.middleware.js";
import { apiLimiter } from "../middleware/rateLimit.middleware.js";
const router = express.Router();

router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  apiLimiter,
  createUserRegisterController
);
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  apiLimiter,
  createUserLoginController
);

router.post("/forgot-password", apiLimiter, forgotPasswordController)
router.post("/reset-password", apiLimiter, resetPasswordController)
export default router;
