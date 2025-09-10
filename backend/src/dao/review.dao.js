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

export async function createReview({ userId, productId, rating, comment }) {
  const newReview = await reviewModel.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });
  
  const product = await productModel.findById(productId);
  const ratingSum = product.ratingSum + rating;
  const numOfReviews = product.numOfReviews + 1;
  const newAverage = Math.round((ratingSum / numOfReviews) * 10) / 10;

  await productModel.findByIdAndUpdate(productId, {
    $inc: { numOfReviews: 1, ratingSum: rating },
    $set: { averageRating: newAverage },
  });
  return newReview;
}

export async function updateReview({ productId, userId, comment, rating }) {
  const product = await productModel.findById(productId);
  const existingReview = await reviewModel.findOne({
    user: userId,
    product: productId,
  });
  if (!existingReview) {
    throw new Error("Review not found");
  }

  const ratingSum = product.ratingSum - existingReview.rating + rating;
  const numOfReviews = product.numOfReviews;
  const updatedAverage = Math.round((ratingSum / numOfReviews) * 10) / 10;

  await productModel.findByIdAndUpdate(productId, {
    $inc: { ratingSum: rating - existingReview.rating },
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

export async function deleteReview({ userId, productId }) {
  const product = await productModel.findById(productId);
  const existingReview = await reviewModel.findOneAndDelete({
    user: userId,
    product: productId,
  });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  const ratingSum = product.ratingSum - existingReview.rating;
  const numOfReviews = product.numOfReviews - 1;

  let newAverage =
    numOfReviews > 0 ? Math.round((ratingSum / numOfReviews) * 10) / 10 : 0;

  await productModel.findByIdAndUpdate(productId, {
    $inc: { numOfReviews: -1, ratingSum: -existingReview.rating },
    $set: { averageRating: newAverage },
  });
  return existingReview;
}

export async function hasPurchased({ userId, productId }) {
  return await orderModel.findOne({
    user: userId,
    "items.product": productId,
  });
}

