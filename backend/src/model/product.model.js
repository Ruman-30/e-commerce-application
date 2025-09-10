import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    numOfReviews: {type: Number, default: 0},
    averageRating: {type: Number, default: 0}
  },
  { timestamps: true }
);

productSchema.index({category: 1}, {createdAt: -1})
productSchema.index({category: 1}, {price: 1})
productSchema.index({price: 1})
productSchema.index({name: "text"}, {description: "text"})

const productModel = mongoose.model("Product", productSchema);
export default productModel;
