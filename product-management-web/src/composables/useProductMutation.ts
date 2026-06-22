import { useFetch } from "./useFetch";
import { computed } from "vue";
import type { IProduct } from "@/types/product";

export function useAddProduct() {
  const url = computed(() => `${import.meta.env.VITE_BASE_API_URL}/api/products`)
  const { data, error, loading, fetchData: post } = useFetch<IProduct>({
    url,
    method: 'POST',
    enabled: false,
  })

  return {
    data,
    error,
    loading,
    post,
  }
}

export function useEditProduct(productId: number) {
  const url = computed(() => `${import.meta.env.VITE_BASE_API_URL}/api/products/${productId}`)

  const { data, error, loading, fetchData: patch } = useFetch<IProduct>({
    url,
    method: 'PATCH',
    enabled: false,
  })

  return {
    data,
    error,
    loading,
    patch,
  }
}
