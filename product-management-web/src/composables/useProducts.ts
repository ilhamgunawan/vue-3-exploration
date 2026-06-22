import { usePagination } from "./usePagination";
import type { IProductsResponse } from "@/types/product";

export function useProducts() {
  const { data, error, loading, currentPageSize, changePageSize, fetchNextPage, fetchPrevPage, refetch } = usePagination<IProductsResponse>('/api/products')

  return { data, error, loading, currentPageSize, changePageSize, fetchNextPage, fetchPrevPage, refetch };
}
