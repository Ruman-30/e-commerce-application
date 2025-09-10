import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
  createProductController,
  deleteProductController,
  updateProductController,
  getAllProductsController,
  getProductByIdController,
} from "../controllers/product.controller.js";
import {
  validateCreateProduct,
  handleValidationErrors,
  validateDeleteProduct,
  validateUpdateProduct,
  validateGetProductById,
} from "../middleware/validator.middleware.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const uploadMulter = multer({ storage: storage });

router.post(
  "/",
  authentication,
  isAdmin,
  uploadMulter.array("images", 5),  
  validateCreateProduct,        
  handleValidationErrors,           
  createProductController
);

router.delete(
  "/product/:productid",
  validateDeleteProduct,
  handleValidationErrors,
  authentication,
  isAdmin,
  deleteProductController
);
router.patch(
  "/product/:productid",
  validateUpdateProduct,
  handleValidationErrors,
  authentication,
  isAdmin,
  uploadMulter.array("images", 5),
  updateProductController
);
router.get(
    "/:productid",
    authentication,
    validateGetProductById,
    handleValidationErrors,
    getProductByIdController
);
router.get("/", authentication, getAllProductsController);


export default router;
