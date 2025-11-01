import orderModel from "../model/order.model.js";

export async function createOrder(orderData) {
  return await orderModel.create(orderData);
}

export async function findOrderById(orderId) {
  return await orderModel
    .findById(orderId)
    .populate("user", "name email")
}


export async function findOrdersByUser(userId, { page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;
  return await orderModel
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

export async function updateOrderStatus(orderId, status) {
  const updateData = { status };
  if (status === "Delivered") {
    updateData.isDelivered = true;
    updateData.deliveredAt = new Date();
    updateData.isPaid = true;
    updateData.paidAt = new Date();
    updateData["payment.paymentStatus"] = "Paid";
  }
  return await orderModel
    .findByIdAndUpdate(orderId, updateData, { new: true })
    .populate("user", "name email")

}

export async function findOrderSummaries({ page = 1, limit = 10 }, filter = {}) {
  const skip = (page - 1) * limit;
  return await orderModel
    .find(filter, {
      status: 1,
      totalAmount: 1,
      createdAt: 1,
      items: { $slice: 1 }, // only the first item
      user: 1,
    })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

export async function countAllOrders(filter) {
  return await orderModel.countDocuments(filter);
}

export async function countUserOrders(userId) {
  return await orderModel.countDocuments({ user: userId });
}

export async function cancelOrder(orderId, userId){
  return await orderModel.findOneAndUpdate(
    {_id: orderId, user: userId, status: {$in: ["Pending", "Confirmed"]}},
    {status: "Cancelled"},
    {new: true}
  )
  .populate("user", "name email")
}

export async function findOrder(orderId){
  return await orderModel.findById(orderId)
}

export async function updateOrderPayment(orderId, paymentData) {
  if (!orderId) throw new Error("Missing orderId in updateOrderPayment.");

  const update = {};

  if (paymentData.razorpay_order_id)
    update["payment.razorpay_order_id"] = paymentData.razorpay_order_id;
  if (paymentData.razorpay_payment_id)
    update["payment.razorpay_payment_id"] = paymentData.razorpay_payment_id;
  if (paymentData.razorpay_signature)
    update["payment.razorpay_signature"] = paymentData.razorpay_signature;

  if (paymentData.paymentStatus) {
    update["payment.paymentStatus"] = paymentData.paymentStatus;
    update["paymentStatus"] = paymentData.paymentStatus;

    if (paymentData.paymentStatus === "Paid") {
      update["isPaid"] = true;
      update["paidAt"] = new Date();
    }
  }

  return await orderModel.findByIdAndUpdate(orderId, { $set: update }, { new: true });
}


