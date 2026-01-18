'use client';

import { useQuery } from "@tanstack/react-query";
import { getCombos } from "@/services/combo.api";
import { useDispatch } from "react-redux";
import { addComboToCart } from "@/redux/cartSlice";

export default function CombosPage() {
  const dispatch = useDispatch();

  const { data: combos } = useQuery({
    queryKey: ["combos"],
    queryFn: getCombos
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {combos?.map(combo => (
        <div key={combo._id} className="border rounded-xl p-4">
          <h2 className="text-lg font-bold">{combo.title}</h2>
          <p className="line-through text-gray-400">
            ৳{combo.products.reduce((a, p) => a + p.price, 0)}
          </p>
          <p className="text-red-600 text-xl font-semibold">
            ৳{combo.comboPrice}
          </p>

          <button
            onClick={() => dispatch(addComboToCart(combo))}
            className="mt-4 w-full bg-black text-white py-2 rounded"
          >
            Add Combo
          </button>
        </div>
      ))}
    </div>
  );
}