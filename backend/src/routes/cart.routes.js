import express from "express";
import {
  addToCartController,
  getCartController,
  updateCartQuantityController,
  removeProductFromCartController,
  clearCartController,
} from "../controllers/cart.controller.js";
import { authentication } from "../middleware/auth.middleware.js";
import {
  validateAddToCart,
  validateUpdateCart,
  handleValidationErrors,
  validateRemoveProduct,
} from "../middleware/validator.middleware.js";
const router = express.Router();

router.post(
  "/add",
  validateAddToCart,
  handleValidationErrors,
  authentication,
  addToCartController
);
router.get("/", authentication, getCartController);
router.put(
  "/update",
  validateUpdateCart,
  handleValidationErrors,
  authentication,
  updateCartQuantityController
);
router.delete(
  "/remove",
  validateRemoveProduct,
  handleValidationErrors,
  authentication,
  removeProductFromCartController
);
router.delete("/clear", authentication, clearCartController);
export default router;
