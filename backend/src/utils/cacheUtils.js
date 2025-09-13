import redis from "../config/redis.js";

export async function clearProductCache(productId) {
  try {
    if (productId) {
      await redis.del(`products:${productId}`);
      console.log(`🗑️ Cleared cache for product:${productId}`);
    }

    const listKeys = await redis.keys("products:list*");
    if (listKeys.length > 0) {
      await redis.del(listKeys);
      console.log("🗑️ Cleared all product list caches");
    }
  } catch (err) {
    console.error("Error clearing products cache:", err);
  }
}

export async function clearReviewCache() {
  try {
    const listKey = await redis.keys("reviews:list*");
    if (listKey.length > 0) {
      await redis.del(listKey);
      console.log("🗑️ Cleared all product list caches");
    }
  } catch (error) {
    console.error("Error clearing products cache:", err);
  }
}
