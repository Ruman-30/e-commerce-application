import {
  findReview,
  updateReview,
  createReview,
  hasPurchased,
  deleteReview,
  getAllReviews,
  countReviews,
} from "../dao/review.dao.js";
import { findProductById } from "../dao/product.dao.js";
import redis from "../config/redis.js";
import { clearReviewCache } from "../utils/cacheUtils.js";

export async function createReviewController(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const productPurchased = await hasPurchased({ userId, productId });
    if (!productPurchased) {
      return res.status(403).json({
        message: "You can only review purchased products",
      });
    }
    const isReviewExist = await findReview({ userId, productId });
    if (isReviewExist) {
      await updateReview({ userId, productId, comment, rating });
      await clearReviewCache()
      return res.status(200).json({
        message: "Review updated successfully.",
      });
    }

    const review = await createReview({ userId, productId, comment, rating });
    await clearReviewCache()
    res.status(201).json({
      message: "Review created successfully.",
      review,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
}

export async function deleteReviewController(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const review = await findReview({ userId, productId });
    if (!review) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }
    await deleteReview({ userId, productId });
    await clearReviewCache()
    res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Deleting review", error: error.message });
  }
}

export async function getAllReviewsController(req, res){
 try {
   const {productId} = req.params
   const page = parseInt(req.query.page) || 1
   const limit = parseInt(req.query.limit) || 20 
   const skip = (page - 1) * limit
 
   const product = await findProductById(productId)
   if(!product){
    return res.status(404).json({
      message: "Product not found!"
    })
   }
    const cacheKey = `reviews:list:${JSON.stringify({
      limit,
      page
    })}`

    const cached = await redis.get(cacheKey)
    if(cached){
      console.log("Serving reviews from redis cache");
      return res.status(200).json({
        message: "Reviews fetched successfully from (cache)",
        reviews: JSON.parse(cached)
      })
      
    }
   const review = await getAllReviews({productId, limit, skip})
   const totalReview = await countReviews({productId})
  
   const response = {
     message: "All product review fetched successfully.",
     review,
     totalReview,
     totalPage: Math.ceil(totalReview / limit)
   }
   await redis.set(cacheKey, JSON.stringify(response), "EX", 1000)
   console.log("📦 Stored in cache:", cacheKey);
   res.status(200).json(response)

 } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
 }
}