import { razorpay } from "../config/config.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { findOrder, updateOrderPayment } from "../dao/order.dao.js";
import { decrementProductStock } from "../dao/product.dao.js";
// import { sendOrderConfirmationEmail } from "../services/emailService.js";
// import { findById } from "../dao/user.dao.js";
import { clearCart } from "../dao/cart.dao.js";

export async function verifyPaymentController(req, res) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // console.log("🟢 Verify Payment Body:", req.body);

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Step 1: Signature verification (built-in Razorpay util)
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is missing from environment variables."
      );
    }

    let isValid = false;
    try {
      isValid = validatePaymentVerification(
        { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
        razorpay_signature,
        secret
      );
      console.log("🟡 Signature valid?", isValid);
    } catch (err) {
      console.error("❌ Signature validation error:", err);
      return res.status(400).json({ message: "Invalid Razorpay signature." });
    }

    if (!isValid) {
      await updateOrderPayment(orderId, {
        razorpay_order_id,
        paymentStatus: "Failed",
      });
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    // Step 2: Fetch payment details from Razorpay API
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
      console.log("🟣 Razorpay Payment Fetch:", payment.status);
    } catch (err) {
      console.error("❌ Razorpay fetch error:", err);
      return res
        .status(500)
        .json({ message: "Error fetching payment from Razorpay." });
    }

    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ message: "Payment not captured." });
    }

    // Step 3: Verify order & amount
    const order = await findOrder(orderId);
    if (!order) {
      console.error("❌ Order not found:", orderId);
      return res.status(404).json({ message: "Order not found." });
    }

    const orderTotal = Number(order.totalAmount);
    const paidTotal = payment.amount / 100;

    if (paidTotal !== orderTotal) {
      console.error("❌ Amount mismatch:", { orderTotal, paidTotal });
      return res.status(400).json({ message: "Amount mismatch!" });
    }

    // Step 4: Update payment details
    const updatedOrder = await updateOrderPayment(order._id, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentStatus: "Paid",
    });

    // Step 5: Update stock & clear cart
    await Promise.all(
      updatedOrder.items.map((item) =>
        decrementProductStock(item.product, item.quantity)
      )
    );

    await clearCart(updatedOrder.user);

    // Step 6: Send confirmation email
    // const user = await findById(updatedOrder.user);
    // if (user?.email) {
    //   await sendOrderConfirmationEmail({
    //     userEmail: user.email,
    //     order: updatedOrder,
    //   });
    // }

    console.log(
      "✅ Payment verified successfully for order:",
      updatedOrder._id
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully 🎉",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("🔥 Error verifying payment:", error);
    return res.status(500).json({
      message: "Error verifying payment",
      error: error.message,
    });
  }
}
