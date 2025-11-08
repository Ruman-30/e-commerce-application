import express from "express";
import {
  createUserRegisterController,
  createUserLoginController,
  registerUserByGoogleController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  refreshTokenController,
  getCurrentUserController,
  getAllUsersController
} from "../controllers/user.controllers.js";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../middleware/validator.middleware.js";
import { apiLimiter } from "../middleware/rateLimit.middleware.js";
import passport from "passport";
import { authentication } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
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
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'  // ✅ Force account selection popup
  })
);

router.get("/google/callback", passport.authenticate("google", {session: false}), registerUserByGoogleController);
router.post("/forgot-password", apiLimiter, forgotPasswordController)
router.post("/reset-password", apiLimiter, resetPasswordController)
router.post("/refresh", refreshTokenController)
router.post("/logout", apiLimiter, authentication, logoutController)
router.get("/me", getCurrentUserController)
router.get("/users", authentication, isAdmin, getAllUsersController)
export default router;
