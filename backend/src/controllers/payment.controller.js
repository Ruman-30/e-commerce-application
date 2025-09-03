import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/payment.service.js";
import { findOrder, updateOrderPayment } from "../dao/order.dao.js";
import { decrementProductStock } from "../dao/product.dao.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
import { findById } from "../dao/user.dao.js";
import { clearCart } from "../dao/cart.dao.js";

export async function createPaymentOrderController(req, res) {
  try {
    const { orderId } = req.body;
    const order = await findOrder(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    const razorpayOrder = await createRazorpayOrder(order);
    await updateOrderPayment(order._id, {
      razorpay_order_id: razorpayOrder.id,
      paymentStatus: "pending",
    });
    if (!razorpayOrder) {
      return res
        .status(400)
        .json({ message: "Error creating payment for this order!" });
    }
    res.status(201).json({
      message: "Order payment is created successfully.",
      order: razorpayOrder,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    res
      .status(500)
      .json({ message: "Error creating Razorpay order", error: error.message });
  }
}

export async function verifyPaymentController(req, res) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const isValid = verifyRazorpayPayment({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    if (!isValid) {
      await updateOrderPayment(orderId, {
        razorpay_order_id,
        paymentStatus: "Failed",
      });
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    const order = await findOrder(orderId);

    if (order.payment?.razorpay_order_id !== razorpay_order_id) {
      return res.status(400).json({ message: "Order ID mismatch!" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if(order.payment.paymentStatus === "Paid"){
      return res.status(400).json({message: "Payment already processed for this order."})
    }

    //   const payment = await razorpay.payments.fetch(razorpay_payment_id);

    //  if (!payment || payment.status !== "captured") {
    //     return res.status(400).json({ message: "Payment not captured" });
    //   }

    //   if (payment.amount / 100 !== order.totalAmount) {
    //     return res.status(400).json({ message: "Amount mismatch!" });
    //   }

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
    await clearCart(updatedOrder.user)
    const user = await findById(updatedOrder.user);
    if (user && user.email) {
      try {
        await sendOrderConfirmationEmail({
          userEmail: user.email,
          order: updatedOrder,
        });
        console.log("Email sent to:", user.email);
      } catch (error) {
        console.error("Failed to send email:", error.message);
      }
    }
    res.status(200).json({
      message: "Payment verified, order updated & confirmation email sent.",
      order: updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
}
