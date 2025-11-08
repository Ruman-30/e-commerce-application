import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/storage.service.js";
import {
  createProduct,
  findProductById,
  deleteProductById,
  updateProduct,
  getAllProducts,
  countProduct,
  getProductById,
} from "../dao/product.dao.js";
import redis from "../config/redis.js";
import { clearProductCache } from "../utils/cacheUtils.js";
import { hasPurchased } from "../dao/review.dao.js";

export async function createProductController(req, res) {
  try {
    const { name, description, price, category, subCategory, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const uploadPromise = req.files.map((file) =>
      uploadToCloudinary(file.buffer, "ecommerce/products")
    );

    const results = await Promise.all(uploadPromise);

    const images = results.map((img) => ({
      url: img.secure_url,
      publicId: img.public_id,
    }));

    const product = await createProduct({
      name,
      description,
      price,
      category,
      subCategory,
      stock,
      images,
    });
    await clearProductCache();
    res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteProductController(req, res) {
  try {
    const productId = req.params.productid;
    const product = await findProductById(productId);
    if (!productId) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deletePromises = product.images.map((img) =>
      deleteFromCloudinary(img.publicId)
    );

    await Promise.all(deletePromises);
    await deleteProductById(productId);
    await clearProductCache(productId);

    res.status(200).json({
      message: "Product and images deleted successfully",
      deletedProductId: productId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProductController(req, res) {
  try {
    const { productid } = req.params;
    const { name, description, price, category, subCategory, stock } = req.body;
    const product = await findProductById(productid);

    if (!product) {
      return res.status(401).json({
        message: "Product not found!",
      });
    }

    let updatedData = {
      name,
      description,
      price,
      category,
      subCategory,
      stock,
    };
    if (req.files && req.files.length > 0) {
      const deletePromise = product.images.map((img) =>
        deleteFromCloudinary(img.publicId)
      );
      await Promise.all(deletePromise);

      const uploadResult = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(file.buffer, "ecommerce/products")
        )
      );

      updatedData.images = uploadResult.map((img) => ({
        url: img.secure_url,
        publicId: img.public_id,
      }));
    }
    const updatedProduct = await updateProduct(productid, updatedData);
    await clearProductCache(productid);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAllProductsController(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.category && typeof req.query.category === "string") {
      filter.category = req.query.category;
    }

    if (req.query.subCategory && typeof req.query.subCategory === "string") {
      filter.subCategory = req.query.subCategory;
    }

    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      let minPrice =
        req.query.minPrice !== undefined ? Number(req.query.minPrice) : 0;
      let maxPrice =
        req.query.maxPrice !== undefined
          ? Number(req.query.maxPrice)
          : Number.MAX_SAFE_INTEGER;

      if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
        return res.status(400).json({ message: "Invalid price range" });
      }

      if (minPrice > maxPrice) {
        return res
          .status(400)
          .json({ message: "minPrice cannot be greater than maxPrice" });
      }

      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // In controller
    const allowedSortFields = ["price", "createdAt"]; // allowed fields for sorting
    let sort = {};

    if (req.query.sort && allowedSortFields.includes(req.query.sort)) {
      sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
    }

    const cacheKey = `products:list:${JSON.stringify({
      filter,
      sort,
      limit,
      page,
      search: req.query.search || "",
    })}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Serving products from Redis cache");
      return res.status(200).json(JSON.parse(cached)); // ✅ return same shape
    }
    const products = await getAllProducts({
      filter,
      sort,
      skip,
      limit,
      search: req.query.search,
    });
    const totalProducts = await countProduct({
      filter,
      search: req.query.search,
    });
    
    const response = {
      message: "All products are fetched",
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);
    console.log("📦 Stored in cache:", cacheKey);
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
}

export async function getProductByIdController(req, res) {
  try {
    const { productid } = req.params;
    const cacheKey = `products:${productid}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("serving from redis cache.");
      const { product, hasPurchased } = JSON.parse(cached);
      return res.status(200).json({
        message: "Product fetched successfully (from cache).",
        product, // no nesting
        hasPurchased, // directly here
      });
    }
    const product = await getProductById(productid);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    let purchased = false;
    if (req.user) {
      try {
        purchased = !!(await hasPurchased({
          userId: req.user,
          productId: product._id,
        }));
      } catch (err) {
        console.error("Failed to check purchase:", err);
        purchased = false;
      }
    }

    const cacheValue = JSON.stringify({
      product,
      hasPurchased: purchased,
    });
    await redis.set(cacheKey, cacheValue, "EX", 300);
    res.status(200).json({
      message: "Product fetched successfully.",
      product,
      hasPurchased: purchased,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Product can't be fetched.", error: error.message });
  }
}
