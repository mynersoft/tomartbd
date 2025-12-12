import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setProducts , addProduct} from "@/store/productSlice";

export default function useProducts() {
	const dispatch = useDispatch();

	 return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/api/products");
      dispatch(setProducts(res.data.products)); // store in Redux
      return res.data.products;
    },
    onError: (error) => {
      toast.error(`Failed to fetch products: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Products fetched successfully");
    },
  });
}



export default function useAddProduct() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation(
    async (productData) => {
      const res = await axios.post("/api/products", productData);
      return res.data.product;
    },
    {
      onMutate: () => {
        toast.loading("Adding product...", { id: "add-product" });
      },
      onSuccess: (newProduct) => {
        dispatch(addProduct(newProduct)); // update Redux
        queryClient.invalidateQueries(["products"]); // refresh cache
        toast.success("Product added successfully!", { id: "add-product" });
      },
      onError: (error) => {
        toast.error(`Failed to add product: ${error.message}`, { id: "add-product" });
      },
    }
  );
}