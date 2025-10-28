import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import { createAdminController, getDashboardStats } from "../controllers/admin.controller.js";
import {
  validateRegister,
  // validateLogin,
  handleValidationErrors,
} from "../middleware/validator.middleware.js";
const router = express.Router();

router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  authentication,
  isAdmin,
  createAdminController
);

router.get("/stats", authentication, isAdmin, getDashboardStats);
export default router;
