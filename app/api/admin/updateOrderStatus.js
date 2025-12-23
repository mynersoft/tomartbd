// pages/api/admin/updateOrderStatus.js
import connectDB from "@/utils/connectDB";
import Order from "@/models/Order";
import { sendEmail } from "@/utils/sendEmail"; // nodemailer utility
// import { sendSMS } from "@/utils/sendSMS"; // optional Twilio/Robi SMS

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ message: "Missing orderId or status" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "cancelled") order.cancelledAt = new Date();
    await order.save();

    // 1️⃣ Send Email Notification
    await sendEmail({
      to: order.customer.email,
      subject: `Your Order ${order.invoice} is ${status}`,
      html: `
        <h2>Order Update</h2>
        <p>Hello ${order.customer.name},</p>
        <p>Your order <strong>${order.invoice}</strong> status is now: <strong>${status}</strong>.</p>
        <p>Thank you for shopping with us!</p>
      `,
    });

    // 2️⃣ Optional: Send SMS Notification
    // await sendSMS(order.customer.phone, `Your order ${order.invoice} status: ${status}`);

    res.status(200).json({ success: true, message: "Order status updated and notification sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}