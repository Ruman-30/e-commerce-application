import crypto from "crypto";
import { razorpay } from "../config/config.js";

export async function createRazorpayOrder(order) {
  const options = {
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: order._id.toString(), 
  };

  return await razorpay.orders.create(options);
}


export function verifyRazorpayPayment({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
}) {
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
    
  return generated_signature === razorpay_signature;
}
