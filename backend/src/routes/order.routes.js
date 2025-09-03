import express from "express";
import {
  createOrderController,
  getOrderByUserController,
  getAllOrdersController,
  updateOrderStatusController,
  cancelOrderController,
  findOrderByIdController,
} from "../controllers/order.controller.js";
import { authentication } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
  createOrderValidator,
  getAllOrdersValidator,
  validateGetSingleOrder,
  validateUpdateOrderStatus,
  handleValidationErrors,
  validateCancelOrder,
} from "../middleware/validator.middleware.js";
const router = express.Router();

router.post(
  "/",
  createOrderValidator,
  handleValidationErrors,
  authentication,
  createOrderController
);
router.get(
  "/",
  validateGetSingleOrder,
  handleValidationErrors,
  authentication,
  findOrderByIdController
);
router.get(
  "/all-orders",
  getAllOrdersValidator,
  handleValidationErrors,
  authentication,
  getOrderByUserController
);
router.get(
  "/admin/orders",
  getAllOrdersValidator,
  handleValidationErrors,
  authentication,
  isAdmin,
  getAllOrdersController
);
router.patch(
  "/:orderId/status",
  validateUpdateOrderStatus,
  handleValidationErrors,
  authentication,
  isAdmin,
  updateOrderStatusController
);
router.patch(
  "/:orderId/cancel",
  validateCancelOrder,
  handleValidationErrors,
  authentication,
  cancelOrderController
);
export default router;
