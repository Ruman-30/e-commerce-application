import { body, validationResult, query, param } from "express-validator";
import mongoose from "mongoose";

// REGISTER VALIDATOR
export const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long."),

  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
];

// LOGIN VALIDATOR
export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),

  body("password").notEmpty().withMessage("Password is required."),
];

export const createOrderValidator = [
  body("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Full name is required"),
  body("shippingAddress.phone")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code is required"),
  // body("items")
  //   .custom((value) => Array.isArray(value) && value.length > 0)
  //   .withMessage("Items must be a non-empty array"),
  body("items.*.product").notEmpty().withMessage("Product ID is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

export const getAllOrdersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be a positive integer between 1 and 100"),
];

export const validateGetSingleOrder = [
  param("orderId")
    .notEmpty()
    .withMessage("Order ID is required.")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Order ID format.");
      }
      return true;
    })
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateUpdateOrderStatus = [
  param("orderId")
    .notEmpty().withMessage("Order ID is required.")
    .isMongoId().withMessage("Invalid Order ID format."),

  body("status")
    .notEmpty().withMessage("Status is required.")
    .isIn(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid status value. Allowed values: Pending, Confirmed, Shipped, Delivered, Cancelled."),
];


export const validateCancelOrder = [
  param("orderId")
    .notEmpty().withMessage("Order ID is required.")
    .isMongoId().withMessage("Invalid Order ID format."),
];


export const validateAddToCart = [
  body("productId")
    .notEmpty().withMessage("Product ID is required.")
    .isMongoId().withMessage("Invalid Product ID format."),

  body("quantity")
    .notEmpty().withMessage("Quantity is required.")
    .isInt({ min: 1 }).withMessage("Quantity must be a positive integer."),
];


export const validateUpdateCart = [
  body("productId")
    .notEmpty().withMessage("Product ID is required.")
    .isMongoId().withMessage("Invalid Product ID format."),
  
  body("quantity")
    .notEmpty().withMessage("Quantity is required.")
    .isInt({ min: 0 }).withMessage("Quantity must be 0 or greater."), 
];


export const validateRemoveProduct = [
   body("productId")
    .notEmpty().withMessage("Product ID is required.")
    .isMongoId().withMessage("Invalid Product ID format."),
]

export const validateCreateProduct = [
  body("name")
    .notEmpty().withMessage("Product name is required.")
    .isLength({ min: 2 }).withMessage("Product name must be at least 2 characters long."),
  
  body("description")
    .optional()
    .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters."),

  body("price")
    .notEmpty().withMessage("Price is required.")
    .isFloat({ gt: 0 }).withMessage("Price must be greater than 0."),
  
  body("category")
    .optional()
    .isString().withMessage("Category must be a string."),
  
  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be 0 or greater."),
];

export const validateDeleteProduct = [
    param("productid")
    .notEmpty().withMessage("Product ID is required.")
    .isMongoId().withMessage("Invalid Product ID format."),
]


export const validateUpdateProduct = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters long."),
  
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),
  
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0."),
  
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string."),
  
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater."),
];


export const validateGetProductById = [
  param("productid")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID format."),
];


export const validateCreateReview = [
  body("rating")
  .notEmpty()
  .withMessage("rating is required")
  .isInt()
  .withMessage("rating should be integar")
  .custom((value)=> value > 0 && value <= 5)
  .withMessage("rating should be between 1 to 5"),
  body("comment")
  .notEmpty()
  .withMessage("comment is required")
  .isString("comment should be string")
  .isLength({max: 500})
  .withMessage("comment cannot exceed 500 characters.")
]