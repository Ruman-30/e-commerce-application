import {
  createOrder,
  findOrdersByUser,
  findOrderById,
  updateOrderStatus,
  findAllOrder,
  countAllOrders,
  countUserOrders,
  cancelOrder,
  updateOrderPayment,
} from "../dao/order.dao.js";
import { clearCart, findCartByUser } from "../dao/cart.dao.js";
import {
  getProductPriceById,
  decrementProductStock,
} from "../dao/product.dao.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
import { createRazorpayOrder } from "../services/payment.service.js";

export async function createOrderController(req, res) {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }
    const { street, country, state, postalCode, phone, fullName, city } =
      shippingAddress;

    const cart = await findCartByUser(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await getProductPriceById(item.product._id);
        return {
          product: item.product._id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
          image: product.images?.[0].url || null,
          itemsTotal: product.price * item.quantity,
        };
      })
    );

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.itemsTotal,
      0
    );

    const newOrder = await createOrder({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        fullName,
        street,
        country,
        state,
        postalCode,
        phone,
        city,
      },
      paymentMethod,
      paymentStatus: "pending",
    });

    if (paymentMethod === "COD") {
      await Promise.all(
        newOrder.items.map((item) =>
          decrementProductStock(item.product, item.quantity)
        )
      );

      await clearCart(userId);
      await sendOrderConfirmationEmail({
        userEmail: req.user.email,
        order: newOrder,
      });

      return res
        .status(201)
        .json({ message: "Order placed successfully (COD).", order: newOrder });
    }

    const razorpayOrder = await createRazorpayOrder(newOrder);

    await updateOrderPayment(newOrder._id, {
      razorpay_order_id: razorpayOrder.id,
    });
    
    res.status(200).json({
      message: "Razorpay order created. Complete payment to confirm.",
      order: newOrder,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
  
export async function getOrderByUserController(req, res) {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const order = await findOrdersByUser(userId, { page, limit });
   
    if (!order || order.length === 0) {
      return res.status(400).json({
        message: "No order yet from this user.",
      });
    }

    const orderSummary = order.map((order) => ({
      orderId: order._id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        city: order.shippingAddress.city,
        country: order.shippingAddress.country,
      },
      items: order.items.map((item) => ({
        productId: item.product._id,
        name: item.name,
        image: item.image || null,
        price: item.price,
        quantity: item.quantity,
        itemTotal: item.price * item.quantity,
      })),
    }));
    const totalOrders = await countUserOrders(userId);

    res.status(200).json({
      message: "Orders fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      order: orderSummary,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getAllOrdersController(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const orders = await findAllOrder({ page, limit }, filter);
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found.",
      });
    }

    const totalOrders = await countAllOrders(filter);
    res.status(200).json({
      message: "Order's fetched successfully.",
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export async function updateOrderStatusController(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (
      !["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].includes(
        status
      )
    ) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }
    const updatedOrder = await updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updates successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ messasge: "Error updating order status", error: error.message });
  }
}

export async function cancelOrderController(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const cancelledOrder = await cancelOrder(orderId, userId);

    if (!cancelledOrder) {
      return res.status(404).json({
        message:
          "Order cannot be cancelled (maybe already shipped/delivered or not your order).",
      });
    }

    res.status(200).json({
      message: "Order cancelled successfully.",
      order: cancelledOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
}

export async function findOrderByIdController(req, res) {
  try {
    const { orderId } = req.params;
    const order = await findOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found!",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully.",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Order can't be fetched.", error: error.message });
  }
}
