import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// GET /api/search?q=term
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    // Fetch all products (or implement more efficient search later)
    const products = await Product.find();

    // Filter by name, brand, category, or tags
    const results = products.filter((p) => {
      const text = `${p.name} ${p.brand} ${p.category} ${(p.tags || []).join(" ")}`.toLowerCase();
      return text.includes(q.toLowerCase());
    });

    return Response.json(results, { status: 200 });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}