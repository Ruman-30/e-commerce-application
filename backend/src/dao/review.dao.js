import reviewModel from "../model/review.model.js";
import productModel from "../model/product.model.js";
import orderModel from "../model/order.model.js";


export async function findReview({ productId, userId }) {
  const review = await reviewModel.findOne({
    user: userId,
    product: productId,
  });
  return review;
}

export async function updateReview({ productId, userId, comment, rating }) {
  const product = await productModel.findById(productId);
  const existingReview = await reviewModel.findOne({
    user: userId,
    product: productId,
  });

  const avgRating = product.averageRating || 0;
  const oldCount = product.numOfReviews || 0;
  const oldRating = existingReview.rating || 0;
  const raw = (avgRating * oldCount - oldRating + rating) / oldCount;
  const updatedAverage = Math.round(raw * 10) / 10;

  await productModel.findByIdAndUpdate(existingReview.product, {
    $set: { averageRating: updatedAverage },
  });

  const updatedReview = await reviewModel.findOneAndUpdate(
    {
      user: userId,
      product: productId,
    },
    { $set: { comment: comment, rating: rating } },
    { new: true }
  );
  return updatedReview;
}

export async function createReview({ userId, productId, rating, comment }) {
  const newReview = await reviewModel.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });
  const product = await productModel.findById(productId);
  const avgRating = product.averageRating || 0;
  const oldCount = product.numOfReviews || 0;

  const raw = (avgRating * oldCount + rating) / (oldCount + 1);
  const newAverage = Math.round(raw * 10) / 10;
  await productModel.findByIdAndUpdate(newReview.product, {
    $inc: { numOfReviews: 1 },
    $set: { averageRating: newAverage },
  });
  return newReview;
}

export async function hasPurchased({ userId, productId }) {
  return await orderModel.findOne({
    user: userId,
    "items.product": productId,
  });
}
