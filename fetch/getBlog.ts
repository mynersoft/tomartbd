import type { IBlog } from "@/types/blog";

export async function getBlog(slug: string): Promise<IBlog | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${slug}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.blog ?? data; // supports both API response shapes
  } catch (error) {
    console.error("getBlog error:", error);
    return null;
  }
}