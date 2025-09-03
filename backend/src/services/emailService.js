import { transporter } from "../config/transporter.js";

export async function sendOrderConfirmationEmail({ userEmail, order }) {

 const itemsHtml = order.items
    .map(
      (item) => `
        <li style="margin-bottom:15px; list-style:none; border-bottom:1px solid #eee; padding-bottom:10px;">
          <img src="${item.image || ""}" 
               alt="${item.name}" 
               width="80" 
               style="vertical-align:middle; margin-right:10px; border-radius:6px;"/>
          <span style="font-size:14px;">
            <b>${item.name}</b><br/>
            Qty: ${item.quantity} × $${item.price} = $${item.price * item.quantity}
          </span>
        </li>
      `
    )
    .join("");


  const plainTextItems = order.items
    .map(
      (item) =>
        `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`
    )
    .join("\n");

  const mailOptions = {
    from: '"UrbanCart" <khanruman799@gmail.com>', // ✅ use name + verified email
    to: userEmail,
    subject: "Order Confirmation",
    text: `Thank you for your order!\n
        Your order ${order._id} has been placed successfully.\n
        Payment ID: ${order.payment?.razorpay_payment_id || "N/A"}\n
        Order Details:\n${plainTextItems}\n
        Total Amount: $${order.totalAmount}`,
     html: `
      <div style="font-family:Arial, sans-serif; color:#333;">
        <h2>Thank you for your order! 🎉</h2>
        <p>Your order <b>${order._id}</b> has been placed successfully.</p>
        <p><b>Payment ID:</b> ${order.payment?.razorpay_payment_id || "N/A"}</p>
        <p><b>Payment Status:</b> ${order.payment.paymentStatus}</p>

        <h3>🛍️ Order Details:</h3>
        <ul style="padding:0;">
          ${itemsHtml}
        </ul>

        <p style="margin-top:15px;"><b>Total Amount:</b> $${order.totalAmount}</p>
        <hr/>
        <p style="font-size:12px; color:#888;">
          This email was sent by UrbanCart. If you have any questions, reply to this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendResetPasswordEmail(email, resetUrl) {
  await transporter.sendMail({
    from: '"UrbanCart" <khanruman799@gmail.com>',
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it (valid for 15 minutes):</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  });
}