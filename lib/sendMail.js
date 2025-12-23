import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderEmail({ to, orderId, status }) {
  const statusText = status.toUpperCase();

  await transporter.sendMail({
    from: `"TomartBD" <${process.env.SMTP_USER}>`,
    to,
    subject: `Order ${orderId} Status Update`,
    html: `
      <div style="font-family: Arial">
        <h2>Order Update</h2>
        <p>Your order <b>#${orderId}</b> status has been updated.</p>
        <h3>Status: ${statusText}</h3>
        <p>Thank you for shopping with TomartBD.</p>
      </div>
    `,
  });
}