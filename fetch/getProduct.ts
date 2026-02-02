import type { IProduct } from '@/types/product';
export async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.product ?? data; // supports both API shapes
  } catch (error) {
    console.error("getProduct error:", error);
    return null;
  }
}