import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromToken } from "@/lib/auth";
import PDFDocument from "pdfkit";

type CartItem = {
  product: { name: string };
  quantity: number;
  price: number;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await Order.findOne({ _id: id, user: user.id }).populate(
    "items.product"
  );

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Create PDF
  const doc = new PDFDocument();
  const buffers: Uint8Array[] = [];

  // Type fix: chunk explicitly typed
  doc.on("data", (chunk: Buffer | Uint8Array) => buffers.push(chunk));

  const pdfPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  (order.items as CartItem[]).forEach((item) => {
    doc.text(
      `${item.product.name} x ${item.quantity} = ৳${item.price * item.quantity}`
    );
  });

  doc.moveDown();
  doc.fontSize(16).text(`Total: ৳${order.total}`);

  doc.end();

  const pdfBuffer = await pdfPromise;

  // Buffer to Uint8Array
  const pdfArray = new Uint8Array(pdfBuffer);

  return new NextResponse(pdfArray, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${order._id}.pdf`,
    },
  });
}