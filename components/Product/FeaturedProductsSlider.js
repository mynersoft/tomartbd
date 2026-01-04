"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "@/store/slices/featuredProductsSlice";
import Slider from "react-slick";

export default function FeaturedProductsSlider() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.featuredProducts
  );

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  if (loading) return <p>Loading featured products...</p>;
  if (error) return <p>Error: {error}</p>;
  if (products.length === 0) return <p>No featured products</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // adjust for responsiveness
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {products.map((product) => (
        <div key={product._id} className="p-2">
          <div className="border rounded overflow-hidden p-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <h3 className="mt-2 font-semibold text-center">{product.name}</h3>
            <p className="text-center text-gray-600">${product.price}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
}