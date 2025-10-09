import { razorpay } from "../config/config.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { findOrder, updateOrderPayment } from "../dao/order.dao.js";
import { decrementProductStock } from "../dao/product.dao.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
import { findById } from "../dao/user.dao.js";
import { clearCart } from "../dao/cart.dao.js";

export async function verifyPaymentController(req, res) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // console.log("Backend received:", req.body);

    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValid) {
      await updateOrderPayment(orderId, {
        razorpay_order_id,
        paymentStatus: "Failed",
      });
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    // ✅ Step 2: Check payment status directly from Razorpay API
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ message: "Payment not captured" });
    }

    const order = await findOrder(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (payment.amount / 100 !== order.totalAmount) {
      return res.status(400).json({ message: "Amount mismatch!" });
    }

    // ✅ Step 3: Mark as paid
    const updatedOrder = await updateOrderPayment(order._id, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentStatus: "Paid",
    });

    await Promise.all(
      updatedOrder.items.map((item) =>
        decrementProductStock(item.product, item.quantity)
      )
    );

    await clearCart(updatedOrder.user);

    const user = await findById(updatedOrder.user);
    if (user && user.email) {
      await sendOrderConfirmationEmail({
        userEmail: user.email,
        order: updatedOrder,
      });
    }

    res.status(200).json({
      message: "Payment verified successfully 🎉",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      message: "Error verifying payment",
      error: error.message,
    });
  }
}

