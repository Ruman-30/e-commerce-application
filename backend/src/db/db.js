import mongoose from "mongoose";
import config from "../config/config.js";
import productModel from "../model/product.model.js";
import orderModel from "../model/order.model.js";

async function connectToDb() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("✅ Connected to DB");

    // Sync indexes for models
    await productModel.syncIndexes();
    await orderModel.syncIndexes();
    console.log("✅ Indexes synced");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}

export default connectToDb;
