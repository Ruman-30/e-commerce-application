import { findReview, updateReview, createReview, hasPurchased } from "../dao/review.dao.js";

export async function createReviewController(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const productPurchased = await hasPurchased({userId, productId})
    if(!productPurchased){
      return res.status(403).json({
        message: "You can only review purchased products"
      })
    }
    const isReviewExist = await findReview({userId, productId});
    if (isReviewExist) {
      await updateReview({ userId, productId, comment, rating });
      return res.status(200).json({
        message: "Review updated successfully.",
      });
    }

    const review = await createReview({ userId, productId, comment, rating });
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
