import redis from "../config/redis.js";

export async function clearProductCache(productId) {
  try {
    const id = productId?.toString();
    if (!id) return console.warn("⚠️ No productId provided to clearProductCache");

    // Get the exact key name
    const singleKey = `products:${id}`;

    // Find and delete both single and related list caches
    const matchingKeys = await redis.keys(`products:*${id}*`);
    const listKeys = await redis.keys("products:list*");

    const allKeysToDelete = [singleKey, ...matchingKeys, ...listKeys];
    const uniqueKeys = [...new Set(allKeysToDelete)];

    if (uniqueKeys.length > 0) {
      await redis.del(uniqueKeys);
      console.log("🧹 Deleted product-related cache keys:", uniqueKeys);
    } else {
      console.log("⚠️ No matching cache keys found for product:", id);
    }
  } catch (err) {
    console.error("❌ Error clearing product cache:", err);
  }
}


export async function clearReviewCache(productId) {
  try {
    const pattern = `reviews:list:${productId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`🗑️ Cleared all review cache for product ${productId}`);
    } else {
      console.log(`ℹ️ No cached reviews found for product ${productId}`);
    }
  } catch (error) {
    console.error("Error clearing review cache:", error);
  }
}

