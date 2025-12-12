import { notFound } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { IProduct } from "@/models/Product";
import WishlistButton from "@/components/WishlistButton";
import AddToCartButton from "@/components/AddToCartButton";

// =======================
// Dynamic SEO
// =======================
export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    const { data } = await api.get(`/products/${params.slug}`);

    return {
        title: `${data.name} | TomartBD`,
        description: data.description,
        openGraph: {
            title: data.name,
            images: [data.images?.[0] || ""],
        },
    };
}

// =======================
// Page
// =======================
export default async function ProductDetailsPage({
    params,
}: {
    params: { slug: string };
}) {
    const res = await api.get(`/products/${params.slug}`);
    const product: IProduct = res.data;

    if (!product) return notFound();

    const price =
        product.finalPrice ??
        product.price - (product.price * (product.discount || 0)) / 100;

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
                <div className="bg-white rounded-lg border p-4">
                    <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-[400px] object-cover rounded"
                    />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 mt-4">
                    {product.images?.map((img, i) => (
                        <Image
                            key={i}
                            src={img}
                            alt="thumb"
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded border cursor-pointer"
                        />
                    ))}
                </div>
            </div>

            {/* Info */}
            <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-500 text-sm mb-4">
                    Category: {String(product.category)}
                </p>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-green-600">
                        ৳ {price}
                    </span>
                    {product.discount ? (
                        <span className="text-lg line-through text-gray-500">
                            ৳ {product.price}
                        </span>
                    ) : null}
                </div>

                {/* Stock */}
                {product.stock > 0 ? (
                    <p className="text-green-600 font-semibold mb-2">
                        In Stock ✅
                    </p>
                ) : (
                    <p className="text-red-600 font-semibold mb-2">
                        Out of Stock ❌
                    </p>
                )}

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                    <AddToCartButton product={product} />
                    <WishlistButton productId={String(product._id)} />
                </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 mt-10 bg-white border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                </p>
            </div>
        </div>
    );
}