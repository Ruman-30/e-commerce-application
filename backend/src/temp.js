// temp.js
import dotenv from "dotenv";
import crypto from "crypto";

// load env file from parent directory
dotenv.config({ path: "../.env" });  

console.log("SECRET from env:", process.env.RAZORPAY_KEY_SECRET); // 👈 should print value

const orderId = "order_RAUMbvkSDVgJIL";  
const paymentId = "pay_test_123456";     

const secret = process.env.RAZORPAY_KEY_SECRET;

if (!secret) {
  throw new Error("RAZORPAY_KEY_SECRET is missing. Check .env file!");
}

const signature = crypto
  .createHmac("sha256", secret)
  .update(orderId + "|" + paymentId)
  .digest("hex");

console.log({ orderId, paymentId, signature });
