import { computed } from "vue";
import type { IProduct } from "@/types/product";
import { useFetch } from "./useFetch";

export function useProduct(productId: number) {
  const url = computed(() => 
    `${import.meta.env.VITE_BASE_API_URL}/api/products/${productId}`
  )

  const { data, error, loading, fetchData } = useFetch<IProduct>({
    url,
    method: 'GET',
    enabled: false,
  })

  return {
    data,
    error,
    loading,
    fetchData,
  }
}
